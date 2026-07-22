
import { useState, useEffect } from "react";
import api from "../../../auth/services/auth.service";
import { useParams, useNavigate as useRouter } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle, XCircle, ArrowLeft, FileText, User, Mail, Phone, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function ApplicationDetail() {
  const params = useParams();
  const router = useRouter();
  const [applicant, setApplicant] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await api.get(`/leads/${params.id}`);
        setApplicant(res.data.lead);
      } catch (err) {
        toast.error("Failed to load applicant.");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchLead();
  }, [params.id]);

  async function handleApprove() {
    setIsProcessing(true);
    try {
      const res = await api.put(`/leads/${params.id}/status`, { status: 'PAYMENT_PENDING' });
      setApplicant({ ...applicant, status: "PAYMENT_PENDING" });
      toast.success("Applicant documents verified successfully! Awaiting payment.");
    } catch (err) {
      toast.error("Failed to verify documents: " + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  async function handleReject() {
    setIsProcessing(true);
    try {
      const res = await api.put(`/leads/${params.id}/status`, { status: 'REJECTED' });
      setApplicant({ ...applicant, status: "REJECTED" });
      toast.error("Application rejected.");
    } catch (err) {
      toast.error("Failed to reject application.");
    } finally {
      setIsProcessing(false);
    }
  };

  async function handlePaymentCompleted() {
    setIsProcessing(true);
    try {
      const res = await api.post(`/leads/${params.id}/approve`);
      
      // Refetch to get the newly generated Student Profile (ERP ID)
      try {
        const freshRes = await api.get(`/leads/${params.id}`);
        setApplicant(freshRes.data.lead);
      } catch (e) {
        setApplicant({ ...applicant, status: "APPROVED" });
      }
      
      toast.success("Payment marked as complete! Enrollment details sent to student.");
    } catch (err) {
      toast.error("Failed to mark payment as complete: " + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="text-foreground text-center mt-10">Loading applicant details...</div>;
  if (!applicant) return <div className="text-foreground text-center mt-10">Applicant not found.</div>;

  return (
    <div className="space-y-6">
      <div className="print:hidden space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router('/admission/applications')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Application Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applicant Details Panel */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-card border-border backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{applicant.firstName} {applicant.lastName}</h3>
                  <p className="text-sm text-muted-foreground">ID: {applicant.id}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{applicant.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{applicant.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{applicant.courseId || "Course Pending"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Actions</CardTitle>
              <CardDescription className="text-muted-foreground">Current Status: {applicant.status}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleApprove} 
                disabled={isProcessing || applicant.status === 'PAYMENT_PENDING' || applicant.status === 'APPROVED' || applicant.status === 'REJECTED'}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-foreground shadow-lg shadow-emerald-900/20"
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Approve Documents
              </Button>
              {applicant.status === 'PAYMENT_PENDING' && (
                <Button 
                  onClick={handlePaymentCompleted} 
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-foreground shadow-lg shadow-blue-900/20"
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Mark Payment Completed
                </Button>
              )}
              {applicant.status === 'APPROVED' && (
                <Button 
                  onClick={() => window.print()} 
                  variant="outline"
                  className="w-full bg-card border-border hover:bg-muted text-foreground shadow-lg"
                >
                  <FileText className="h-4 w-4 mr-2" /> Print Admission Letter
                </Button>
              )}
              <Button 
                onClick={handleReject} 
                disabled={isProcessing || applicant.status === 'REJECTED' || applicant.status === 'APPROVED'}
                variant="destructive" 
                className="w-full shadow-lg shadow-red-900/20"
              >
                <XCircle className="h-4 w-4 mr-2" /> Reject Application
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Document Viewer Panel */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border backdrop-blur-lg h-full">
            <CardHeader>
              <CardTitle className="text-foreground">Submitted Documents</CardTitle>
              <CardDescription className="text-muted-foreground">Review documents before approving the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applicant.documents.map((doc, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4 bg-black/20 hover:bg-card border-r border-border transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">{doc.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${doc.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'}`}>
                        {doc.status}
                      </span>
                    </div>
                    {/* Mock Document Preview */}
                    <div className="h-40 bg-card rounded flex items-center justify-center border border-dashed border-border">
                      <p className="text-muted-foreground text-sm">Preview not available in mock</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="w-full bg-card border-border hover:bg-muted">View Full</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      {/* Print-Only Admission Letter */}
      <div className="hidden print:block absolute inset-0 bg-white p-12 text-black print:min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center border-b-2 border-black pb-6 flex flex-col items-center">
            <img src="/logo.png" alt="Graphic Era Logo" className="h-24 w-24 object-contain mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight uppercase">Graphic Era University</h1>
            <p className="text-xl mt-2 text-gray-600">Official Admission Letter</p>
          </div>
          
          <div className="flex justify-between items-start pt-4">
            <div>
              <p className="font-bold text-lg">Enrollment ID (ERP): <span className="font-mono text-xl">{applicant.studentProfile?.erpId || 'PENDING'}</span></p>
              <p className="text-gray-600 mt-1">Application Ref: {applicant.id}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Date: {new Date().toLocaleDateString()}</p>
              <p className="font-medium">Status: ADMISSION CONFIRMED</p>
            </div>
          </div>

          <div className="pt-6">
            <p className="text-lg leading-relaxed mb-6">Dear {applicant.firstName} {applicant.lastName},</p>
            <p className="text-lg leading-relaxed mb-6">
              Congratulations! We are pleased to inform you that your application for the <strong>{applicant.courseId}</strong> program at Graphic Era University has been successfully processed and your admission is confirmed.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Your dedication and academic background stand out, and we are excited to have you join us for the upcoming academic session. Please review the details below:
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Full Name</p>
                  <p className="font-semibold text-lg">{applicant.firstName} {applicant.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Course Enrolled</p>
                  <p className="font-semibold text-lg">{applicant.courseId}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email Address</p>
                  <p className="font-semibold text-lg">{applicant.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone Number</p>
                  <p className="font-semibold text-lg">{applicant.phone}</p>
                </div>
              </div>
            </div>

            <p className="text-lg">Welcome to the Graphic Era University community!</p>
            
            <div className="mt-16">
              <p className="text-sm text-gray-600">Office of Admissions</p>
              <p className="font-bold">Graphic Era University</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
