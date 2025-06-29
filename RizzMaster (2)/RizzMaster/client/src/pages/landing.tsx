import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, MessageCircle, Heart, Crown } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">RizzGPT</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your AI-powered dating and relationship assistant. Get personalized advice, conversation starters, and relationship guidance.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Conversations</h3>
              <p className="text-slate-600">Get personalized conversation starters and learn how to keep discussions engaging and meaningful.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Relationship Advice</h3>
              <p className="text-slate-600">Receive expert guidance on dating, relationships, and building authentic connections with others.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Crown className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Features</h3>
              <p className="text-slate-600">Unlock unlimited conversations, advanced strategies, and personalized coaching with Pro.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={handleLogin}
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl"
          >
            Get Started - It's Free
          </Button>
          <p className="text-sm text-slate-500 mt-4">
            Start with 10 free messages per day. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
