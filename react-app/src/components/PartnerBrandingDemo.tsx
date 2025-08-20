import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PARTNER_BRANDS } from "@shared/partner-branding";
import { MessageCircle, Users, TrendingUp } from "lucide-react";

export function PartnerBrandingDemo() {
  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner White-Label Branding System</h1>
        <p className="text-gray-600">Flexible branding configurations for each partner's unique identity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.values(PARTNER_BRANDS).map((brand) => (
          <Card key={brand.partnerId} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${brand.colors.primary} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{brand.agentName.charAt(0)}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{brand.partnerName}</CardTitle>
                    <p className="text-sm text-gray-600">{brand.agentBrand}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {brand.partnerId}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Color Palette */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Brand Colors</h4>
                <div className="flex space-x-2">
                  <div className={`w-6 h-6 bg-${brand.colors.primary} rounded border`} title="Primary"></div>
                  <div className={`w-6 h-6 bg-${brand.colors.secondary} rounded border`} title="Secondary"></div>
                  <div className={`w-6 h-6 bg-${brand.colors.avatar} rounded border`} title="Avatar"></div>
                  <div className={`w-6 h-6 bg-${brand.colors.chat.background} rounded border`} title="Chat Background"></div>
                </div>
              </div>

              {/* Sample Interface */}
              <div className={`bg-gradient-to-r from-${brand.colors.gradient.from} to-${brand.colors.gradient.to} rounded-lg p-4 border`}>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-800">{brand.agentName}'s Intelligence Brief</h5>
                  <Button 
                    size="sm" 
                    className={`bg-${brand.colors.button.primary} hover:bg-${brand.colors.button.hover} text-white`}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Ask {brand.agentName}
                  </Button>
                </div>
                
                <div className={`bg-${brand.colors.chat.background} rounded p-3 text-sm`}>
                  <div className="flex items-start space-x-2">
                    <div className={`w-5 h-5 bg-${brand.colors.chat.avatar} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-bold">{brand.agentName.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-xs">
                        I'm your AI {brand.messaging.roleDescription} specializing in {brand.messaging.specialization} 
                        to accelerate your journey {brand.messaging.journey}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messaging Profile */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Brand Messaging</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div><span className="font-medium">Industry:</span> {brand.messaging.industry}</div>
                  <div><span className="font-medium">Role:</span> {brand.messaging.roleDescription}</div>
                  <div><span className="font-medium">Specialization:</span> {brand.messaging.specialization}</div>
                  <div><span className="font-medium">Journey:</span> {brand.messaging.journey}</div>
                </div>
              </div>

              {/* Sample Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-800">15</div>
                  <div className="text-xs text-gray-600">Active Users</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-800">98%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Guide */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Adding New Partners</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>1. Add partner configuration to <code>shared/partner-branding.ts</code></p>
                <p>2. Define custom colors, messaging, and agent branding</p>
                <p>3. Update context detection logic for automatic partner identification</p>
                <p>4. Test across all interface components for consistent theming</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Customization Options</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Colors:</strong> Primary, secondary, gradients, avatars, buttons</p>
                <p>• <strong>Messaging:</strong> Industry focus, role descriptions, specializations</p>
                <p>• <strong>Assets:</strong> Logos, favicons, background images (optional)</p>
                <p>• <strong>Agent Identity:</strong> Names, brands, personalities</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}