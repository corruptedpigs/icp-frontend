"use client";

const NewFooter = () => (
  <footer className="py-16 border-t border-border/50">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Corrupted Pigs" className="h-10" />
          <span className="font-display text-xl text-foreground">CPIGS™</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="//x.com/CorruptedPigs" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">X / Twitter</a>
          <a href="//github.com/CorruptedPigs/icp-frontend" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
          <a href="//corruptedpigs.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Website</a>
        </div>
        <p className="text-xs text-muted-foreground">
          <a href='mailto:thendorsement@proton.me'>thendorsement@proton.me</a> · +351 91 9022909
        </p>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} CPigs™. Blockchain Gaming Meets Social Goods.
      </p>
    </div>
  </footer>
);

export default NewFooter;
