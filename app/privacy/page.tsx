import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-mono">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-4">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p>
              Welcome to Hackeroso. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Data We Collect</h2>
            <p>
              Hackeroso is designed with privacy in mind. We do not collect or store any personal information on our servers. 
              All user data, including saved items, tasks, and preferences, are stored locally in your browser using 
              localStorage. This means your data remains on your device and is not transmitted to or stored by us.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Data</h2>
            <p>
              Since we do not collect your data, we do not use it for any purpose. The data you create while using 
              Hackeroso (such as saved items and tasks) is used solely to provide functionality within the application 
              and remains on your device.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
            <p>
              While we do not store your data on our servers, we encourage you to take appropriate measures to protect 
              the data stored locally on your device. This may include using device encryption, strong passwords, and 
              keeping your browser and operating system up to date.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Third-Party Services</h2>
            <p>
              Hackeroso uses the Hacker News API to fetch content. When you interact with this content, you may be 
              subject to Hacker News' terms and privacy policy. We encourage you to review their policies as well.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, you can contact us:
            </p>
            <ul className="list-disc pl-6">
              <li>By email: privacy@hackeroso.com</li>
              <li>By visiting this page on our website: <a href="/support" className="text-primary hover:underline">Support Page</a></li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

