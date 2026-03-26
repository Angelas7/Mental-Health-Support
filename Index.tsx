import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FloatingParticles from "@/components/FloatingParticles";
import WelcomeScreen from "@/components/WelcomeScreen";
import MoodPicker from "@/components/MoodPicker";
import QuoteCard from "@/components/QuoteCard";
import ExercisePicker from "@/components/ExercisePicker";
import BreathingExercise from "@/components/BreathingExercise";
import StretchingExercise from "@/components/StretchingExercise";
import MoodHistory from "@/components/MoodHistory";

type Screen = "welcome" | "mood" | "quote" | "exercise-pick" | "breathing" | "stretching" | "history";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [userName, setUserName] = useState("");
  const [moodHistory, setMoodHistory] = useState<string[]>([]);
  const [currentMood, setCurrentMood] = useState("");

  const handleStart = (name: string) => {
    setUserName(name);
    setScreen("mood");
  };

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    setMoodHistory((prev) => [...prev, mood]);
    setScreen("quote");
  };

  const handleNewSession = () => {
    setScreen("mood");
  };

  return (
    <div className="min-h-screen gradient-warm relative overflow-hidden">
      <FloatingParticles />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {screen === "welcome" && <WelcomeScreen onStart={handleStart} />}
            {screen === "mood" && <MoodPicker userName={userName} onSelect={handleMoodSelect} />}
            {screen === "quote" && <QuoteCard mood={currentMood} onContinue={() => setScreen("exercise-pick")} />}
            {screen === "exercise-pick" && (
              <ExercisePicker
                onSelect={(type) => setScreen(type === "breathing" ? "breathing" : "stretching")}
                onSkip={() => setScreen("history")}
              />
            )}
            {screen === "breathing" && <BreathingExercise onComplete={() => setScreen("history")} onBack={() => setScreen("exercise-pick")} />}
            {screen === "stretching" && <StretchingExercise onComplete={() => setScreen("history")} onBack={() => setScreen("exercise-pick")} />}
            {screen === "history" && (
              <MoodHistory userName={userName} history={moodHistory} onNewSession={handleNewSession} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
