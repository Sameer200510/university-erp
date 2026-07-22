
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate as useRouter } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Component mounted
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    router(`/admission/applications/${search}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Manage Applications</h2>
        <div className="flex items-center gap-2">
          <Link to="/admission/apply">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              + New Application
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-xl">
        <Card className="bg-card border-border backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Find Application</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the applicant's Reference ID to view and manage their admission process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter Reference ID (e.g. REF123456)" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-card border-border text-foreground focus-visible:ring-primary h-12"
                  required
                />
              </div>
              <Button type="submit" className="h-12 px-6 bg-primary hover:bg-primary/90">
                View Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
