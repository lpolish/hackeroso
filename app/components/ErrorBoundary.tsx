'use client'

import React, { ErrorInfo } from 'react'
import { Button } from "./ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Oops, there was an error!</h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md mb-4 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Error details:</h3>
            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
              <code>
                {this.state.error && this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </code>
            </pre>
          </div>
          <div className="flex space-x-4">
            <Button 
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null })
                window.location.reload()
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Try again
            </Button>
            <Button 
              onClick={() => {
                const errorDetails = `Error: ${this.state.error}\n\nComponent Stack: ${this.state.errorInfo?.componentStack}`;
                console.error("Reported error:", errorDetails);
                alert("Error reported. Thank you for your feedback!");
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Report Error
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

