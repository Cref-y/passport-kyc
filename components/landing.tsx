"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, Shield, Lock, Repeat, Zap } from "lucide-react";
import { KycForm } from "./kyc-form";
import { PassportPreviewSection } from "./passport-preview-section";
import { VideoShowcase } from "./video-showcase";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const [showKyc, setShowKyc] = React.useState(false);
    const router = useRouter();
    const handleStartKyc = () => {
        setShowKyc(true);
        setTimeout(() => {
            document.getElementById("kyc-section")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
            {/* Header/Navigation - Improved spacing and alignment */}
            <header className="w-full py-5 border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-700">crefy</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">Products</a>
                        <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">Solutions</a>
                        <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">Resources</a>
                        <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            
                            className="bg-purple-700 hover:bg-purple-800 px-6 py-2 text-white font-medium shadow-md"
                            onClick={() => router.push("/admin")}
                        >
                            Dashboard
                        </Button>
                        <Button className="bg-purple-700 hover:bg-purple-800 px-6 py-2 text-white font-medium" onClick={handleStartKyc}>
                            Demo
                        </Button>
                    </div>
                </div>
            </header>

            {/* Conditional rendering */}
            {showKyc ? (
                <section id="kyc-section" className="w-full py-16">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto mb-12">
                            <Button
                                variant="outline"
                                className="mb-6"
                                onClick={() => setShowKyc(false)}
                            >
                                ← Back to Home
                            </Button>
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">Complete Your KYC Verification</h2>
                            <p className="text-lg text-gray-600">Please complete all steps to verify your identity and receive your Crefy Digital Passport.</p>
                        </div>
                        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
                            <KycForm />
                        </div>
                    </div>
                </section>
            ) : (
                <>
                    {/* Hero Section - Improved layout and visual hierarchy */}
                    <section className="w-full py-24 md:py-32">
                        <div className="container mx-auto px-6 flex justify-center">
                            <div className="flex flex-col md:flex-row gap-12 items-center justify-center mb-16 w-full">
                                <div className="flex-1 space-y-6 max-w-2xl text-center">
                                    <div className="inline-block rounded-lg bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                                        Enterprise Identity Solutions
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                                        Crefy Passports
                                    </h1>
                                    <p className="text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
                                        Empower your business with our enterprise-grade identity verification system. Streamline compliance and enhance trust with customizable verification bundles.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
                                        <Button size="lg" className="bg-purple-700 hover:bg-purple-800 px-8 py-6 text-lg font-medium" onClick={handleStartKyc}>
                                            Schedule a Demo
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-purple-700 text-purple-700 px-8 py-6 text-lg font-medium">
                                            Enterprise Solutions
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-6 text-base text-gray-600 pt-4 justify-center">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            <span>100+ <br></br>Passports created</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            <span> $ 4.7 M <br></br>Client Cost Savings</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            <span>15+ <br></br> Integrations</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            <span> 99% <br></br>Privacy </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <VideoShowcase />

                    </section>

                    {/* Features Section - Improved card design and spacing */}
                    <section className="w-full py-24 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col items-center text-center mb-20">
                                <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
                                    Comprehensive Identity Verification Suite
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl">
                                    Customizable verification modules designed for enterprise needs with privacy-first architecture
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-24">
                                <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                                        <Shield className="h-8 w-8 text-purple-700" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Corporate Identity</h3>
                                    <p className="text-gray-600">
                                        Proof of Incorporation and Authorized Representative verification for seamless business validation
                                    </p>
                                </div>

                                <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                                        <Repeat className="h-8 w-8 text-purple-700" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Financial Verification</h3>
                                    <p className="text-gray-600">
                                        Comprehensive Proof of Assets and Tax Status verification for financial compliance
                                    </p>
                                </div>

                                <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                                        <Lock className="h-8 w-8 text-purple-700" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Professional Credentials</h3>
                                    <p className="text-gray-600">
                                        Verify Proof of Education and Professional Memberships with privacy controls
                                    </p>
                                </div>

                                <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                                        <Zap className="h-8 w-8 text-purple-700" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Social & Health</h3>
                                    <p className="text-gray-600">
                                        Validate Proof of Social Reputation and Health Status with customizable privacy settings
                                    </p>
                                </div>
                            </div>

                            {/* Passport Preview Section */}
                            <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-8 md:p-10 lg:p-12">
                                    <div className="flex flex-col items-center text-center mb-12">
                                        <div className="inline-block rounded-lg bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 mb-6">
                                            Enterprise Solutions
                                        </div>
                                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
                                            Customizable Verification Bundles
                                        </h2>
                                        <p className="text-xl text-gray-600 max-w-2xl">
                                            Create tailored verification packages with granular privacy controls for your specific business needs
                                        </p>
                                    </div>
                                    <PassportPreviewSection />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action - Improved visual appeal */}
                    <section className="w-full py-24 bg-purple-50">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-800 p-12 text-white max-w-6xl mx-auto shadow-xl">
                                <div className="space-y-6 max-w-xl">
                                    <h2 className="text-4xl font-bold tracking-tight">
                                        Transform Your Business Identity Verification
                                    </h2>
                                    <p className="text-xl text-purple-100">
                                        Join leading enterprises in modernizing their verification processes with our customizable identity solutions.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        size="lg"
                                        className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg font-medium shadow-md"
                                        onClick={() => router.push("/admin")}
                                    >
                                        Dashboard
                                    </Button>
                                    <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg font-medium shadow-md" onClick={handleStartKyc}>
                                        Book a Call
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="container mx-auto px-6">


                        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
                            <p className="text-gray-600">© 2025 Crefy. All rights reserved.</p>
                            <div className="flex gap-6 mt-6 md:mt-0">
                                <a href="#" className="text-gray-600 hover:text-purple-700">Terms</a>
                                <a href="#" className="text-gray-600 hover:text-purple-700">Privacy</a>
                                <a href="#" className="text-gray-600 hover:text-purple-700">Cookies</a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}