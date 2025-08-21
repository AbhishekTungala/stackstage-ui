import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { ThemeProvider } from "@/hooks/use-theme";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Assistant from "./pages/Assistant";
import Analyze from "./pages/Analyze";
import Results from "./pages/Results";
import Fixes from "./pages/Fixes";
import Diagram from "./pages/Diagram";
import Share from "./pages/Share";
import Docs from "./pages/Docs";
import Enterprise from "./pages/Enterprise";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import Status from "./pages/Status";
import Community from "./pages/Community";
import Changelog from "./pages/Changelog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/assistant" component={Assistant} />
            <Route path="/analyze" component={Analyze} />
            <Route path="/results" component={Results} />
            <Route path="/fixes" component={Fixes} />
            <Route path="/diagram" component={Diagram} />
            <Route path="/results/fixes" component={Fixes} />
            <Route path="/results/diagram" component={Diagram} />
            <Route path="/results/share" component={Share} />
            <Route path="/docs" component={Docs} />
            <Route path="/enterprise" component={Enterprise} />
            <Route path="/about" component={About} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/support" component={Support} />
            <Route path="/status" component={Status} />
            <Route path="/community" component={Community} />
            <Route path="/changelog" component={Changelog} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route component={NotFound} />
          </Switch>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
