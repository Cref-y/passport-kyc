import { Button } from "@/components/ui/button"
import { Check, Copy, ExternalLink } from "lucide-react"

export function PassportPreviewSection() {
    return (

        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                <div className="space-y-2">
                    <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-700">
                        Digital Identity
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Your Crefy Digital Passport</h2>
                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        A secure, portable identity credential you control
                    </p>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-md">
                    {/* Passport UI based on the provided image */}
                    <div className="border rounded-lg overflow-hidden shadow-lg">
                        {/* Header */}
                        <div className="bg-purple-700 text-white p-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">PASSPORT</h3>
                                <p className="text-sm">CREFY DIGITAL IDENTITY</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Check className="h-6 w-6" />
                            </div>
                        </div>

                        {/* Verified stamp */}
                        <div className="p-6 bg-white relative">
                            <div className="absolute top-4 right-4 transform rotate-12 border-2 border-purple-600 text-purple-600 px-4 py-1 rounded-md font-bold">
                                VERIFIED
                            </div>

                            <div className="text-center mb-6 mt-4">
                                <h3 className="text-xl font-bold text-purple-600">Welcome, mulinyafadhil!</h3>
                                <p className="text-gray-600">Your digital passport is now active</p>
                            </div>

                            {/* Passport ID */}
                            <div className="bg-purple-50 p-3 rounded-md mb-3 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-purple-400">Passport ID:</p>
                                    <p className="text-purple-600 font-mono">mulinyafadhil.crefy.eth</p>
                                </div>
                                <button className="text-purple-500">
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Mapped Address */}
                            <div className="bg-purple-50 p-3 rounded-md mb-3 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-purple-400">Mapped Address:</p>
                                    <p className="text-purple-600 font-mono text-xs">0xc514a305a1101c56fa7fbA949e536832a911b386</p>
                                </div>
                                <button className="text-purple-500">
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>

                            {/* NFT Status */}
                            <div className="bg-green-50 p-3 rounded-md mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <p className="text-green-600">NFT Passport received</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center">
                                        <span className="text-white text-xs">@</span>
                                    </div>
                                    <p className="text-purple-600">mulinyafadhil.crefy.eth registered</p>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="bg-purple-50 p-3 rounded-md mb-3">
                                <p className="text-center font-medium text-purple-600 mb-2">Transaction Details</p>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-500">Transaction Hash:</p>
                                    <button className="text-purple-500">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 font-mono mb-2">
                                    0x95216518eb6402052740c4432ed996d738a328af495...
                                </p>
                                <div className="text-center">
                                    <a
                                        href="https://sepolia.etherscan.io/tx/0x95216518eb6402052740c4432ed996d738a328af495d93347b5abb0632591681"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" size="sm" className="text-purple-600 border-purple-600">
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            View on Etherscan
                                        </Button>
                                    </a>

                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between mt-4">
                                <Button variant="outline" size="sm" className="text-gray-500">
                                    Back
                                </Button>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                    Home
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
