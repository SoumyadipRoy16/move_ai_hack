"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowDown, ArrowUp, Copy, LineChart, Plus, Settings, Wallet } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { Eye, EyeOff } from "lucide-react"
import { AptosClient, BCS, TxnBuilderTypes, Types } from "aptos" // Added more imports

declare global {
  interface Window {
    aptos: any
  }
}

const aptosClient = new AptosClient('https://fullnode.devnet.aptoslabs.com') // Initialize AptosClient

// Fixed address as specified
const FIXED_ADDRESS = '0x9c206f7c7f9e3e345695e3f32bef3d27a7667080d6e8efaa2a056d003b150684'
// Minimum balance required in dollars
const MIN_BALANCE = 500

export default function WalletPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [totalBalance, setTotalBalance] = useState<string>("$ --")
  const [availableBalance, setAvailableBalance] = useState<string>("$ --")
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')

  // Load wallet data from localStorage on component mount
  useEffect(() => {
    const savedWalletAddress = localStorage.getItem("walletAddress")
    const savedTotalBalance = localStorage.getItem("totalBalance")
    const savedAvailableBalance = localStorage.getItem("availableBalance")

    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress)
      fetchBalance(savedWalletAddress) // Fetch balance if wallet address is saved
    }
    if (savedTotalBalance) setTotalBalance(savedTotalBalance)
    if (savedAvailableBalance) setAvailableBalance(savedAvailableBalance)
  }, [])

  // Function to fetch balance from Aptos Devnet and convert to USD
  const fetchBalance = async (address: string) => {
    try {
      const response = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${address}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`
      )
      const data = await response.json()

      if (data?.data?.coin?.value) {
        const balanceInOctas = parseInt(data.data.coin.value) // Balance in smallest units (octas)
        const balanceInAPT = balanceInOctas / 1e8 // Convert octas to APT

        // Fetch current APT price in USD (example using CoinGecko API)
        const aptPriceResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd"
        )
        const aptPriceData = await aptPriceResponse.json()
        const aptPriceInUSD = aptPriceData.aptos.usd

        // Convert APT to USD
        const balanceInUSD = (balanceInAPT * aptPriceInUSD).toFixed(2) // Total balance in USD
        const availableBalanceInUSD = (balanceInAPT * aptPriceInUSD * 0.8).toFixed(2) // 80% of total balance

        // Update the UI and localStorage
        setTotalBalance(`$${balanceInUSD}`)
        setAvailableBalance(`$${availableBalanceInUSD}`)
        localStorage.setItem("totalBalance", `$${balanceInUSD}`)
        localStorage.setItem("availableBalance", `$${availableBalanceInUSD}`)
      } else {
        console.error("Failed to fetch balance: Invalid data format")
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    }
  }

  const connectWallet = async () => {
    if (typeof window.aptos !== "undefined") {
      try {
        const response = await window.aptos.connect()
        setWalletAddress(response.address)
        localStorage.setItem("walletAddress", response.address) // Save wallet address to localStorage
        fetchBalance(response.address) // Fetch balance after connecting
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      console.error("Petra wallet is not installed")
    }
  }

  const disconnectWallet = async () => {
    if (typeof window.aptos !== "undefined") {
      try {
        await window.aptos.disconnect() // Disconnect the wallet
        setWalletAddress(null)
        setTotalBalance("$ --")
        setAvailableBalance("$ --")
        localStorage.removeItem("walletAddress") // Remove wallet address from localStorage
        localStorage.removeItem("totalBalance") // Remove total balance from localStorage
        localStorage.removeItem("availableBalance") // Remove available balance from localStorage
      } catch (error) {
        console.error("Failed to disconnect wallet:", error)
      }
    }
  }

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (!walletAddress) {
      alert('Please connect your wallet first')
      return
    }

    try {
      // For deposit: FIXED_ADDRESS is the sender and walletAddress is the receiver
      // Note: This approach requires FIXED_ADDRESS to sign the transaction
      // In a real app, this would be handled by a backend service or smart contract
      
      // Create transaction payload for direct transfer
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [
          walletAddress, // Receiver is the user's connected wallet
          Math.floor(amount * 1e8).toString() // Convert to octas (APT's smallest unit)
        ]
      }
      
      // In a real application, this would be signed by the FIXED_ADDRESS account
      console.log('Deposit payload (would be signed by fixed address):', payload)
      
      // Update dashboard balance in localStorage
      const {currentBalance, newBalance} = updateDashboardBalance(amount, true)
      
      // For demo purposes, simulate successful transaction
      alert(`Deposit successful: $${amount} added. Dashboard balance updated from $${currentBalance.toFixed(2)} to $${newBalance.toFixed(2)}`)
      
      // In production, after backend confirms transfer:
      fetchBalance(walletAddress)
      setDepositAmount('')
      
      // Dispatch a custom event that dashboard.tsx can listen for
      const event = new CustomEvent('dashboardBalanceUpdated', { 
        detail: { newBalance: newBalance } 
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Deposit failed:', error)
      alert('Deposit failed: ' + (error.message || 'Unknown error'))
    }
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (!walletAddress) {
      alert('Please connect your wallet first')
      return
    }
    
    // Get current dashboard balance to check minimum
    const dashboardBalanceStr = localStorage.getItem("dashboardBalance") || "4231.89"
    const currentBalance = parseFloat(dashboardBalanceStr)
    
    // Check if withdrawal would bring balance below minimum
    if ((currentBalance - amount) < MIN_BALANCE) {
      alert(`Cannot withdraw $${amount}. Balance would drop below minimum $${MIN_BALANCE}. Maximum withdrawal: $${(currentBalance - MIN_BALANCE).toFixed(2)}`)
      return
    }
    
    try {
      // For withdrawal: walletAddress is the sender and FIXED_ADDRESS is the receiver
      // User's wallet needs to sign this transaction
      
      // Create transaction payload for direct transfer
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [
          FIXED_ADDRESS, // Receiver is the fixed address
          Math.floor(amount * 1e8).toString() // Convert to octas
        ]
      }
      
      // Sign and submit the transaction using Petra wallet
      const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload)
      
      // Wait for transaction to be confirmed
      await aptosClient.waitForTransaction(pendingTransaction.hash)
      
      // Update dashboard balance in localStorage
      const {currentBalance, newBalance} = updateDashboardBalance(amount, false)
      
      console.log('Withdrawal successful:', pendingTransaction)
      alert(`Withdrawal successful! $${amount} transferred. Dashboard balance updated from $${currentBalance.toFixed(2)} to $${newBalance.toFixed(2)}`)
      
      // Refresh balance after successful withdrawal
      fetchBalance(walletAddress)
      setWithdrawAmount('')
      
      // Dispatch a custom event that dashboard.tsx can listen for
      const event = new CustomEvent('dashboardBalanceUpdated', { 
        detail: { newBalance: newBalance } 
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Withdrawal failed:', error)
      alert('Withdrawal failed: ' + (error.message || 'Unknown error'))
    }
  }

  return (
    <div className="flex min-h-screen dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-0"></div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <LineChart className="h-6 w-6 text-primary" />
              <span>CryptoSentinel</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href="/wallet"
              className="text-sm font-medium text-primary hover:text-primary/80 border-b-2 border-primary"
            >
              Wallet
            </Link>
            <Link href="/bot" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Telegram Bot
            </Link>
            <Link href="/settings" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
              <p className="text-muted-foreground">Manage your AI agent's wallet and transactions</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1">
                <ArrowDown className="h-4 w-4" />
                Withdraw
              </Button>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add Funds
              </Button>
              <Button
                onClick={walletAddress ? disconnectWallet : connectWallet}
                className="gap-1"
              >
                {walletAddress ? (
                  <>
                    <Wallet className="h-4 w-4" />
                    Disconnect Wallet
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  >
                    {isBalanceVisible ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle Balance Visibility</span>
                  </Button>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isBalanceVisible ? totalBalance : "******"}
                </div>
                {totalBalance !== "$ --" && (
                  <div className="flex items-center pt-1 text-xs text-emerald-500">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>+20.1% from last month</span>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available for Trading</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableBalance}</div>
                {availableBalance !== "$ --" && (
                  <p className="text-xs text-muted-foreground">80% of total balance</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Copy Address</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div
                  className="text-sm font-mono bg-muted p-2 rounded-md overflow-x-auto cursor-pointer"
                  onClick={handleCopyAddress}
                >
                  {walletAddress || "Connect your wallet to view address"}
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  {walletAddress ? "Click to copy address" : "Connect your Petra wallet to view address"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="deposit" className="space-y-4">
            <TabsList>
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Funds to Your AI Agent</CardTitle>
                  <CardDescription>Fund your AI agent's wallet to enable automated trading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Select Deposit Method</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="font-bold mb-1">Cryptocurrency</div>
                        <div className="text-xs text-muted-foreground text-center">
                          Deposit using BTC, ETH, or other cryptocurrencies
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="font-bold mb-1">Credit Card</div>
                        <div className="text-xs text-muted-foreground text-center">
                          Instant deposit using Visa, Mastercard, or Amex
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="font-bold mb-1">Bank Transfer</div>
                        <div className="text-xs text-muted-foreground text-center">
                          Deposit via ACH or wire transfer (1-3 business days)
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Deposit Amount</div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                      <Button onClick={handleDeposit}>Deposit</Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Minimum deposit: $100. Funds will be available for trading immediately.
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Deposit Instructions</CardTitle>
                  <CardDescription>Follow these steps to complete your deposit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        1
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Select your preferred deposit method</div>
                        <div className="text-sm text-muted-foreground">
                          Choose from cryptocurrency, credit card, or bank transfer options
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        2
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Enter the amount you wish to deposit</div>
                        <div className="text-sm text-muted-foreground">The minimum deposit amount is $100</div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        3
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Complete the payment process</div>
                        <div className="text-sm text-muted-foreground">
                          Follow the instructions to complete your payment securely
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        4
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Funds will be added to your wallet</div>
                        <div className="text-sm text-muted-foreground">
                          Your AI agent will now be able to trade with these funds
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="withdraw" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>Withdraw funds from your AI agent's wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Select Withdrawal Method</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="font-bold mb-1">Cryptocurrency</div>
                        <div className="text-xs text-muted-foreground text-center">Withdraw to your crypto wallet</div>
                      </div>
                      <div className="flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="font-bold mb-1">Bank Account</div>
                        <div className="text-xs text-muted-foreground text-center">
                          Withdraw to your linked bank account
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer hover:border-primary">
                        <div className="font-bold mb-1">PayPal</div>
                        <div className="text-xs text-muted-foreground text-center">Withdraw to your PayPal account</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Withdrawal Amount</div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <Button onClick={handleWithdraw}>Withdraw</Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Available for withdrawal: $1,245.32. Withdrawals are processed within 24 hours.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View all your wallet transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_150px] gap-4 font-medium text-sm text-muted-foreground">
                      <div>Transaction</div>
                      <div className="text-right">Amount</div>
                      <div className="text-right">Status</div>
                      <div className="text-right">Date</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_150px] gap-4 items-center py-3 border-b">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                          <ArrowDown className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <div className="font-medium">Deposit</div>
                          <div className="text-xs text-muted-foreground">Credit Card</div>
                        </div>
                      </div>
                      <div className="text-right text-emerald-500">+$1,000.00</div>
                      <div className="text-right">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                          Completed
                        </div>
                      </div>
                      <div className="text-right text-muted-foreground text-sm">Feb 28, 2025</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_150px] gap-4 items-center py-3 border-b">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <div className="font-medium">Withdrawal</div>
                          <div className="text-xs text-muted-foreground">Bank Transfer</div>
                        </div>
                      </div>
                      <div className="text-right text-red-500">-$500.00</div>
                      <div className="text-right">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-500/10 text-yellow-500">
                          Pending
                        </div>
                      </div>
                      <div className="text-right text-muted-foreground text-sm">Feb 27, 2025</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_150px] gap-4 items-center py-3 border-b">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                          <ArrowDown className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <div className="font-medium">Deposit</div>
                          <div className="text-xs text-muted-foreground">Cryptocurrency (ETH)</div>
                        </div>
                      </div>
                      <div className="text-right text-emerald-500">+$2,500.00</div>
                      <div className="text-right">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                          Completed
                        </div>
                      </div>
                      <div className="text-right text-muted-foreground text-sm">Feb 20, 2025</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_150px] gap-4 items-center py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <div className="font-medium">Withdrawal</div>
                          <div className="text-xs text-muted-foreground">PayPal</div>
                        </div>
                      </div>
                      <div className="text-right text-red-500">-$750.00</div>
                      <div className="text-right">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                          Completed
                        </div>
                      </div>
                      <div className="text-right text-muted-foreground text-sm">Feb 15, 2025</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <ToastProvider>
        <Toast
          open={isCopied}
          onOpenChange={setIsCopied}
          variant="success"
          position="top"
        >
        Copied to clipboard!
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </div>
  )
}
