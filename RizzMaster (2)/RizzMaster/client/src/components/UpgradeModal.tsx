import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Check } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const handleUpgrade = () => {
    // TODO: Integrate with payment processor
    alert("Payment integration would be implemented here");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl">Upgrade to RizzGPT Pro</DialogTitle>
          <DialogDescription>
            Unlock advanced features and unlimited conversations
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Free Plan</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  10 messages per day
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Basic conversation tips
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Standard response time
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-400 bg-yellow-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                Pro Plan
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Unlimited messages
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Advanced dating strategies
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Priority response time
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Personalized advice
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Export chat history
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-gray-900 mb-1">
            $9.99
            <span className="text-lg font-normal text-gray-600">/month</span>
          </p>
          <p className="text-sm text-gray-500">Cancel anytime</p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
