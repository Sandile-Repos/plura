import Navigation from "@/components/site/navigation";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navigation />
      {children}
    </main>
  );
};

export default layout;
