import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/home";
import Quiz from "./pages/quiz";
import PersonalBoxes from "./pages/personal-boxes";
import ReadyBoxes from "./pages/ready-boxes";
import About from "./pages/about";
import Order from "./pages/order";
import OrderSuccess from "./pages/order-success";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/personal-boxes" component={PersonalBoxes} />
      <Route path="/ready-boxes" component={ReadyBoxes} />
      <Route path="/about" component={About} />
      <Route path="/order" component={Order} />
      <Route path="/order-success" component={OrderSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="telegram-app font-inter">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
