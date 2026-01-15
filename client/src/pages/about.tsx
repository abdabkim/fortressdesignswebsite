import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Target, Heart, Zap, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import coverArt from "@assets/neon-light-clothing-room-background_1764621287706_1764684267795.jpg";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Quality First",
      description: "We use only premium materials and partner with top manufacturers to ensure every piece meets our high standards.",
    },
    {
      icon: Heart,
      title: "Passion Driven",
      description: "Every design is crafted with passion and purpose. We believe clothing is a form of self-expression.",
    },
    {
      icon: Zap,
      title: "Bold Innovation",
      description: "We push boundaries and challenge conventions. Our designs are for those who dare to be different.",
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "We're building more than a brand—we're building a community of bold individuals who support each other.",
    },
  ];

  const team = [
    {
      name: "Alex Rivera",
      role: "Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    },
    {
      name: "Jordan Lee",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    },
    {
      name: "Taylor Morgan",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-white py-20 border-b" data-testid="about-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900" data-testid="text-about-title">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Built by creators, for creators. Fortress Designs was born from a passion for bold self-expression and premium quality.
          </p>
        </div>
      </section>

      <section className="py-20" data-testid="about-story">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Where Bold Meets Quality
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fortress Designs started in 2020 with a simple mission: create clothing that helps people express their unique identity without compromising on quality.
                </p>
                <p>
                  We noticed a gap in the market—streetwear that looked good but fell apart after a few washes, or quality basics that lacked personality. We decided to bridge that gap.
                </p>
                <p>
                  Today, we partner with premium print-on-demand manufacturers to deliver designs that are as durable as they are distinctive. Every piece is printed with care and shipped directly to you.
                </p>
                <p>
                  Fortress Designs isn't just a brand—it's a community of individuals who refuse to blend in. Welcome to the family.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src={coverArt}
                  alt="Fortress Designs Studio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-xl shadow-xl">
                <div className="text-4xl font-bold">5K+</div>
                <div className="text-sm text-white/80">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y" data-testid="about-values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-border" data-testid={`value-card-${index}`}>
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex p-4 rounded-full gradient-bg-accent mb-4">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="about-team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Meet the Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center" data-testid={`team-member-${index}`}>
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 border-4 border-primary">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" data-testid="about-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our collection and find the pieces that speak to you.
          </p>
          <Link href="/shop">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 border-0 text-lg px-10 py-6" data-testid="button-explore-shop">
              Explore the Shop
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
