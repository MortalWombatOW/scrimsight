import { useAuth } from "react-oidc-context";
import PrimaryButton from "../components/PrimaryButton";
import {
  Play,
  BarChart3,
  Check,
  Shield,
  Zap,
  Crown,
  MessageCircle,
} from "lucide-react";
import { useScrimsightNavigation } from "../hooks/useScrimsightNavigation";

const LandingPage = () => {
  const auth = useAuth();
  const { navigate } = useScrimsightNavigation();

  const handleSignIn = () => {
    auth.signinRedirect();
  };

  const handleDemo = () => {
    navigate("/demo");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <nav className="navbar bg-base-100 sticky top-0 z-50 backdrop-blur-sm bg-base-100/90 pl-4 pr-4">
        <div className="navbar-start">
          <span
            className="text-2xl font-black"
            style={{ fontFamily: "Goldman" }}
          >
            SCRIMSIGHT
          </span>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <button
                onClick={() => scrollToSection("features")}
                className="btn btn-ghost"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("pricing")}
                className="btn btn-ghost"
              >
                Pricing
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("faq")}
                className="btn btn-ghost"
              >
                FAQ
              </button>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <button onClick={handleDemo} className="btn btn-ghost hidden sm:flex">
            View Demo
          </button>
          <PrimaryButton onClick={handleSignIn}>Login</PrimaryButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero min-h-screen bg-gradient-to-br from-primary/20  to-secondary/20">
        <div className="hero-content text-center max-w-4xl mx-auto">
          <div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Get serious about your scrims
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-base-content/80 max-w-3xl mx-auto">
              Take your team to the next level with actionable insights and
              analytics with Scrimsight
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton onClick={handleSignIn}>
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Started with Discord
              </PrimaryButton>
              <button onClick={handleDemo} className="btn btn-outline btn-lg">
                <Play className="w-5 h-5 mr-2" />
                Explore Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Scrimsight?</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Transform your scrim data into competitive advantages with our
              powerful analytics platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <Zap className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title text-2xl mb-4">Easy Integration</h3>
                <p className="text-base-content/70">
                  Load your Scrimtime logs and get instant insights. No complex
                  setup required - just upload and analyze.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <BarChart3 className="w-12 h-12 text-secondary mb-4" />
                <h3 className="card-title text-2xl mb-4">
                  Actionable Insights
                </h3>
                <p className="text-base-content/70">
                  Find the structure behind the chaos of scrims by reviewing
                  matches and exploring player and team performance.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <Shield className="w-12 h-12 text-accent mb-4" />
                <h3 className="card-title text-2xl mb-4">Secure & Private</h3>
                <p className="text-base-content/70">
                  Your data is processed locally and never leaves your device,
                  ensuring your strategies remain confidential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Demos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Analytics Features
            </h2>
            <p className="text-xl text-base-content/70">
              Dive deep into your team's performance with comprehensive
              analytics
            </p>
          </div>

          <div className="space-y-16">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">Match Timeline</h3>
                <p className="text-lg text-base-content/70 mb-6">
                  Complement your in-game replays with detailed timelines
                  showing teamfights, ultimate economy, and kill breakdowns.
                </p>
                <div className="mockup-window bg-base-300 border">
                  <div className="bg-base-200 flex justify-center px-4 py-16">
                    <div className="text-base-content/50">
                      Match Timeline Demo
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">Player Performance</h3>
                <p className="text-lg text-base-content/70 mb-6">
                  Analyze individual player stats, including KDA, damage/healing
                  dealt, ultimate efficiency, and hero performance.
                </p>
                <div className="mockup-window bg-base-300 border">
                  <div className="bg-base-200 flex justify-center px-4 py-16">
                    <div className="text-base-content/50">
                      Player Stats Demo
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">Team Synergy</h3>
                <p className="text-lg text-base-content/70 mb-6">
                  Review team compositions, historical trends, and coordination
                  to improve teamwork and strategy.
                </p>
                <div className="mockup-window bg-base-300 border">
                  <div className="bg-base-200 flex justify-center px-4 py-16">
                    <div className="text-base-content/50">
                      Team Analysis Demo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-base-content/70">
              Choose the plan that fits your team's needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title text-2xl justify-center mb-4">
                  Casual
                </h3>
                <div className="text-4xl font-bold mb-6">
                  $0
                  <span className="text-lg font-normal text-base-content/60">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>Up to 5 matches</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>Local data processing</span>
                  </li>
                </ul>
                <PrimaryButton onClick={handleSignIn}>
                  Get Started
                </PrimaryButton>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl border-2 border-primary">
              <div className="card-body text-center">
                <div className="badge badge-primary mb-2">Most Popular</div>
                <h3 className="card-title text-2xl justify-center mb-4 items-center gap-2">
                  Pro
                  <Crown className="w-5 h-5 text-yellow-500" />
                </h3>
                <div className="text-4xl font-bold mb-6">
                  $10
                  <span className="text-lg font-normal text-base-content/60">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>Unlimited matches</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span>Team collaboration tools</span>
                  </li>
                </ul>
                <PrimaryButton onClick={handleSignIn}>
                  Upgrade to Pro
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-base-content/70">
              Everything you need to know about Scrimsight
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                What is Scrimsight?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  Scrimsight is a data-driven web application that helps players
                  and teams improve their performance by providing actionable
                  insights and analytics from your scrim data.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                How does it work?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  Scrimsight integrates with your existing scrim logs generated
                  by Scrimtime, processes the data locally, and provides
                  detailed analytics on player and team performance.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                Is my data secure?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/70">
                  Absolutely! Scrimsight processes your data locally and never
                  sends it to external servers, ensuring your strategies and
                  performance data remain completely confidential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Level Up Your Team?
          </h2>
          <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Join teams already using Scrimsight to gain competitive advantages
            through data-driven insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton onClick={handleSignIn}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Sign in with Discord
            </PrimaryButton>
            <button onClick={handleDemo} className="btn btn-outline btn-lg">
              <Play className="w-5 h-5 mr-2" />
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <span
            className="text-2xl font-black mb-4"
            style={{ fontFamily: "Goldman" }}
          >
            SCRIMSIGHT
          </span>
          <p className="text-base-content/70">
            Empowering esports teams with data-driven insights
          </p>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <a href="#" className="btn btn-ghost btn-circle">
              <MessageCircle className="w-6 h-6" />
            </a>
          </div>
        </div>
        <div>
          <p className="text-base-content/60">
            © 2024 Scrimsight. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
