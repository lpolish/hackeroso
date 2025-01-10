'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from "@/components/ui/button"
import { ArrowRight, Repeat, Sparkles, X } from 'lucide-react'

interface DonationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DonationDialog({ open, onOpenChange }: DonationDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!mounted) return null

  const oneTimeDonations = [
    { amount: 5, url: 'https://buy.stripe.com/5kA6q48JocGj7qU4gl' },
    { amount: 12, url: 'https://donate.stripe.com/7sI4hW5xcfSv9z2cMP' },
  ]

  const recurringDonations = [
    { amount: 5, url: 'https://buy.stripe.com/8wM9Cg6BgfSvfXq3cj' },
    { amount: 10, url: 'https://buy.stripe.com/00g3dS1gWdKnh1u9AI' },
    { amount: 20, url: 'https://buy.stripe.com/7sIdSw2l035JaD6bIR' },
  ]

  const dialog = (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-[500px] rounded-lg bg-background p-6 shadow-lg transition-all duration-200 ${
            open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="flex items-center gap-2 text-2xl font-semibold mb-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            Support Hackeroso
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Your support helps keep Hackeroso free and open source. Choose a donation option below.
          </p>

          <div className="space-y-6">
            {/* One-time donations */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                One-time donation
                <ArrowRight className="h-3 w-3" />
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {oneTimeDonations.map((donation) => (
                  <Button
                    key={donation.amount}
                    variant="outline"
                    className="h-auto py-4 flex flex-col hover:border-orange-500 dark:hover:border-green-500"
                    onClick={() => window.open(donation.url, '_blank')}
                  >
                    <span className="text-2xl font-bold">${donation.amount}</span>
                    <span className="text-xs text-muted-foreground mt-1">USD</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Monthly donations */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                Monthly support
                <Repeat className="h-3 w-3" />
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {recurringDonations.map((donation) => (
                  <Button
                    key={donation.amount}
                    variant="outline"
                    className="h-auto py-4 flex flex-col hover:border-orange-500 dark:hover:border-green-500"
                    onClick={() => window.open(donation.url, '_blank')}
                  >
                    <span className="text-2xl font-bold">${donation.amount}</span>
                    <span className="text-xs text-muted-foreground mt-1">per month</span>
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Payments are processed securely through Stripe. 
              Your support helps maintain and improve Hackeroso.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(
    dialog,
    document.getElementById('modal-root') || document.body
  )
}

