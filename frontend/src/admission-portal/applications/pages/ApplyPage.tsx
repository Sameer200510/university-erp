
import { useState } from "react";
import api from "../../../auth/services/auth.service";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CheckCircle, ChevronRight, ChevronLeft, UploadCloud, Printer } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courseId: "",
  });
  const [files, setFiles] = useState({
    aadhaar: null,
    marksheet: null,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
    
    if (step === 3 && (!files.aadhaar || !files.marksheet)) {
      toast.error("Please upload all required documents.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/leads/apply', formData);
      const leadId = res.data.lead.id;
      const shortRef = leadId.substring(0, 8).toUpperCase();
      setTrackingId(shortRef);

      if (files.aadhaar) {
        const fd = new FormData();
        fd.append("file", files.aadhaar);
        await api.post(`/leads/${leadId}/documents`, fd);
      }

      if (files.marksheet) {
        const fd = new FormData();
        fd.append("file", files.marksheet);
        await api.post(`/leads/${leadId}/documents`, fd);
      }

      setStep(4);
    } catch (error) {
      console.error(error);
      let errorMessage = "Failed to submit application.";
      if (error.response?.data?.errors?.length > 0) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-60 mix-blend-screen animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] opacity-60 mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="z-10 w-full max-w-2xl">
        <div className="mb-8 flex justify-center items-center gap-2">
          <img src="/logo.png" alt="Graphic Era Logo" className="h-12 w-12 object-contain" />
          <Link to="/" className="text-2xl font-bold text-primary">
            Graphic Era University
          </Link>
        </div>

        <Card className="bg-card border-border backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center border-b border-border pb-6 bg-primary rounded-t-xl text-primary-foreground pt-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${step >= s ? 'bg-secondary text-secondary-foreground' : 'bg-primary-foreground/20 text-white'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`w-12 h-1 mx-2 rounded-full transition-colors ${step > s ? 'bg-secondary' : 'bg-primary-foreground/20'}`} />}
                </div>
              ))}
            </div>
            <CardTitle className="text-2xl text-white">
              {step === 1 && "Personal Information"}
              {step === 2 && "Academic Details"}
              {step === 3 && "Document Upload"}
              {step === 4 && "Application Submitted!"}
            </CardTitle>
            <CardDescription className="text-white/80">
              {step === 1 && "Tell us about yourself."}
              {step === 2 && "What are you applying for?"}
              {step === 3 && "Upload your verification documents."}
              {step === 4 && "Your application is under review."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {step === 4 ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-6">
                  Your application has been received successfully. Please save this Reference ID to track your status.
                </p>

                <div className="bg-muted p-6 rounded-lg mb-8 max-w-sm mx-auto">
                  <p className="text-sm text-muted-foreground mb-2">Your Reference ID</p>
                  <p className="text-3xl font-mono font-bold tracking-wider text-foreground">
                    {trackingId}
                  </p>
                  <p className="text-sm text-muted-foreground mt-6 mb-6">
                    You can use this ID to track your application status.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Button variant="outline" onClick={() => window.print()} className="print:hidden">
                      <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Link to="/">
                      <Button variant="outline" className="w-full sm:w-auto print:hidden">Return Home</Button>
                    </Link>
                    <Link to="/admission/status">
                      <Button className="w-full sm:w-auto print:hidden">Check Status</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                        <Input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="bg-card border-border text-foreground focus-visible:ring-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                        <Input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="bg-card border-border text-foreground focus-visible:ring-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <Input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <Input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Select Course</label>
                      <select required value={formData.courseId} onChange={(e) => setFormData({...formData, courseId: e.target.value})} className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <option value="" className="text-black">Select a course...</option>
                        <option value="B.Tech Computer Science" className="text-black">B.Tech Computer Science</option>
                        <option value="Bachelor of Business Admin" className="text-black">Bachelor of Business Admin</option>
                        <option value="Master of Business Admin" className="text-black">Master of Business Admin</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Previous School/College</label>
                      <Input required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Percentage / CGPA</label>
                      <Input type="number" required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <div className="p-6 border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center text-center hover:bg-muted transition-colors cursor-pointer group">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-foreground font-medium mb-1">Upload Aadhaar Card</h4>
                      <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</p>
                      <Input type="file" className="hidden" id="aadhaar" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles({ ...files, aadhaar: e.target.files[0] })} />
                      <label htmlFor="aadhaar" className="mt-4 text-xs font-semibold text-primary cursor-pointer hover:underline">
                        {files.aadhaar ? files.aadhaar.name : "Browse File"}
                      </label>
                    </div>

                    <div className="p-6 border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center text-center hover:bg-muted transition-colors cursor-pointer group">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-foreground font-medium mb-1">Upload Previous Marksheet</h4>
                      <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</p>
                      <Input type="file" className="hidden" id="marksheet" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles({ ...files, marksheet: e.target.files[0] })} />
                      <label htmlFor="marksheet" className="mt-4 text-xs font-semibold text-primary cursor-pointer hover:underline">
                        {files.marksheet ? files.marksheet.name : "Browse File"}
                      </label>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={step === 1 ? () => window.location.href = '/' : prevStep}
                    disabled={isSubmitting}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground min-w-[120px] shadow-lg">
                    {isSubmitting ? "Processing..." : step === 3 ? "Submit Application" : "Continue"}
                    {!isSubmitting && step < 3 && <ChevronRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
