import { useState, useEffect } from "react"

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const savedWalletAddress = localStorage.getItem("walletAddress")
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress)
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window.aptos !== "undefined") {
      try {
        const response = await window.aptos.connect()
        setWalletAddress(response.address)
        localStorage.setItem("walletAddress", response.address)
        return response.address
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        throw error
      }
    } else {
      console.error("Petra wallet is not installed")
      throw new Error("Petra wallet is not installed")
    }
  }

  const disconnectWallet = async () => {
    if (typeof window.aptos !== "undefined") {
      try {
        await window.aptos.disconnect()
        setWalletAddress(null)
        localStorage.removeItem("walletAddress")
      } catch (error) {
        console.error("Failed to disconnect wallet:", error)
        throw error
      }
    }
  }

  return {
    walletAddress,
    connectWallet,
    disconnectWallet,
  }
}