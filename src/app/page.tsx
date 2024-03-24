import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <section className="container mt-20 flex h-full flex-col items-center justify-center gap-6 py-10 text-foreground md:max-w-[70vw] md:gap-12">
      <h1 className="text-5xl font-bold md:text-7xl">Catchphrase</h1>
      <p className="text-base md:text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <Button className="h-full w-fit px-4 py-2 text-lg md:text-xl">
        Try it now!
      </Button>
    </section>
  );
}
