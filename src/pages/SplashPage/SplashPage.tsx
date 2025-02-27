import SplashRow from "./SplashRow";

const SplashPage = () => {
  return (
    <div className="w-full">
      <div className="mx-12">
        <div>
          <h1 className="text-4xl font-bold mb-5">
            Do you manage or coach a competitive Overwatch team?
          </h1>
          <p className="text-base mb-5">
            Scrimsight takes the guesswork out of analyzing your team&apos;s
            performance. With detailed statistics and replay features, you can
            quickly identify and communicate the issues that are holding your
            team back and make better-informed decisions to supercharge your
            team. Use Scrimsight to find the keys to victory for your team!
          </p>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#F9A03F",
        }}
        className="w-full"
      >
        <div
          style={{
            backgroundColor: "#f3f3f3",
          }}
          className="w-full flex flex-wrap px-12 mt-12 pb-8 gap-4"
        >
          <button className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
            Explore example data
          </button>
          <button className="px-6 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors">
            Get started with your data
          </button>
        </div>
      </div>

      <SplashRow
        title="Easy to set up"
        content="With a custom workshop code, your scrims are automatically logged to your PC."
        image="/assets/settingsscreen.png"
        beforeBackgroundColor="#001732"
        backgroundColor="#F9A03F"
        textColor="black"
        button={{
          text: "Get started",
          onClick: () => {},
        }}
      />
      <SplashRow
        title="Control your data"
        content="All of your data is stored and processed locally on your PC. Load your data manually or integrate with your prefered file storage service."
        image="/assets/settingsscreen.png"
        beforeBackgroundColor="#F9A03F"
        backgroundColor="#001732"
        textColor="white"
        button={{
          text: "Learn more",
          onClick: () => {},
        }}
      />
      <SplashRow
        title="Cumulative insights"
        content="Browse metrics for players and teams over time. The more games you log, the more insights you'll gain."
        image="/assets/settingsscreen.png"
        beforeBackgroundColor="#001732"
        backgroundColor="#F9A03F"
        textColor="black"
        button={{
          text: "See an example",
          onClick: () => {},
        }}
      />
      <SplashRow
        title="Revisit matches"
        content="See how the match unfolded with the play-by-play viewer. Link to specific moments in your match to share with your team."
        image="/assets/settingsscreen.png"
        beforeBackgroundColor="#F9A03F"
        backgroundColor="#001732"
        textColor="white"
        button={{
          text: "Try it out",
          onClick: () => {},
        }}
      />
      <div
        style={{
          backgroundColor: "#F9A03F",
        }}
        className="w-full flex justify-center p-5"
      >
        <p className="text-base">
          Terms of Service | Privacy Policy | © 2022 Andrew Gleeson
        </p>
      </div>
    </div>
  );
};

export default SplashPage;
