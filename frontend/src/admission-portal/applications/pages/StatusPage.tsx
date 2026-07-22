
import { useState } from "react";
import api from "../../../auth/services/auth.service";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, CheckCircle, Clock, XCircle, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function StatusPage() {
  const [trackingId, setTrackingId] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.get(`/leads/${trackingId}`);
      const data = res.data.lead;
      
      setStatus({
        id: data.id,
        name: `${data.firstName} ${data.lastName}`,
        course: data.courseId || "Pending",
        currentStatus: data.status, 
        dateApplied: new Date(data.createdAt).toLocaleDateString(),
      });
    } catch (err) {
      toast.error("Application not found. Please check your Reference ID.");
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (currentStatus) => {
    switch (currentStatus) {
      case 'ADMITTED': return <CheckCircle className="h-16 w-16 text-emerald-500" />;
      case 'REJECTED': return <XCircle className="h-16 w-16 text-red-500" />;
      default: return <Clock className="h-16 w-16 text-blue-500" />;
    }
  };

  const getStatusMessage = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING': return "Your application is currently under review by our admissions team.";
      case 'PAYMENT_PENDING': return "Your documents have been verified! Please visit the Fee Cell with your reference page to pay the admission fee.";
      case 'APPROVED': return "Congratulations! Your admission is confirmed. Check your email for login credentials.";
      case 'REJECTED': return "Unfortunately, we could not proceed with your application at this time.";
      default: return "Processing...";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen animate-blob" />
      </div>

      <div className="z-10 w-full max-w-xl">
        <div className="mb-8 flex justify-center items-center gap-2">
          <img src="/logo.png" alt="Graphic Era Logo" className="h-10 w-10 object-contain" />
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Graphic Era University
          </Link>
        </div>

        <Card className="bg-card border-border backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl text-foreground">Track Your Application</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your Reference ID to see the real-time status of your admission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter Reference ID (e.g. REF123456)" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground focus-visible:ring-primary h-12"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="h-12 px-6 bg-primary hover:bg-primary/90">
                {isLoading ? "Searching..." : "Track"}
              </Button>
            </form>

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-border"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-card rounded-full border border-border">
                    {getStatusIcon(status.currentStatus)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {status.currentStatus.replace('_', ' ')}
                    </h3>
                    <p className="text-muted-foreground">
                      {getStatusMessage(status.currentStatus)}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Applicant Name</p>
                    <p className="text-sm font-medium text-foreground">{status.name}</p>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Course Applied</p>
                    <p className="text-sm font-medium text-foreground">{status.course}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {status.currentStatus === 'PAYMENT_PENDING' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm text-center">
                      Please visit the Fee Cell on campus with this reference page to complete your admission payment.
                    </motion.div>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => window.print()} 
                    className="w-full h-12 bg-card border-border text-foreground hover:bg-muted"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Print Reference Page
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
