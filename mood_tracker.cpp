#include <iostream>
#include <fstream>
#include <ctime>
#include <thread>
#include <chrono>
#include <vector>

using namespace std;

// 🔹 Get Current Time
string getCurrentTime() {
    time_t now = time(0);
    char* dt = ctime(&now);
    return string(dt);
}

// 🔹 Save Mood to File
void saveMood(const string& mood) {
    ofstream file("mood_log.txt", ios::app);
    if (file.is_open()) {
        file << "[" << getCurrentTime() << "] Mood: " << mood << endl;
        file.close();
        cout << "✅ Mood saved successfully.\n";
    } else {
        cerr << "❌ Error opening mood_log.txt: Permission denied\n";
    }
}

// 🔹 Track Mood
void trackMood() {
    string mood;
    cout << "\n🧠 Enter your current mood (Happy, Sad, Anxious, Angry, Lonely): ";
    cin >> mood;

    if (mood == "Happy")
        cout << "🌞 That's wonderful! Keep smiling!\n";
    else if (mood == "Sad")
        cout << "💧 It's okay to feel sad. Try writing down what you're feeling.\n";
    else if (mood == "Anxious")
        cout << "🌬️ Take a deep breath. You're doing the best you can.\n";
    else if (mood == "Angry")
        cout << "🔥 It's alright to be angry. Try to express it in a healthy way.\n";
    else if (mood == "Lonely")
        cout << "🤝 You're not alone. Reach out to someone you trust.\n";
    else
        cout << "💬 Mood noted. Take care of yourself.\n";

    saveMood(mood);
}

// 🔹 Breathing Exercise
void breathingExercise() {
    cout << "\n🧘 Starting a short breathing exercise...\n";
    for (int i = 0; i < 3; ++i) {
        cout << "\n🫁 Breathe in... 🫁\n";
        this_thread::sleep_for(chrono::seconds(4));
        cout << "😌 Hold... 😌\n";
        this_thread::sleep_for(chrono::seconds(4));
        cout << "🌬️ Breathe out... 🌬️\n";
        this_thread::sleep_for(chrono::seconds(4));
    }
    cout << "✅ Well done! Feel the calm.\n";
}

// 🔹 Motivational Prompt
void showMotivation() {
    vector<string> quotes = {
        "🌟 You are stronger than you think.",
        "💖 One step at a time is still progress.",
        "🌈 Storms don’t last forever.",
        "🔥 You’ve made it this far, don’t give up now!",
        "🌻 Even the darkest night will end and the sun will rise."
    };

    srand(time(0));
    int index = rand() % quotes.size();
    cout << "\n💡 Motivation: " << quotes[index] << "\n";
}

// 🔹 Main Menu
int main() {
    int choice;

    cout << "📘 Welcome to Calmin: Your Mood Tracker 🌿\n";
    cout << "----------------------------------------\n";

    do {
        cout << "\n1. Track Mood\n";
        cout << "2. View Mood History\n";
        cout << "3. Calming Breathing Exercise\n";
        cout << "4. Show a Motivational Prompt\n";
        cout << "5. Exit\n";
        cout << "Choose an option (1-5): ";
        cin >> choice;

        switch (choice) {
            case 1:
                trackMood();
                break;
            case 2: {
                ifstream file("mood_log.txt");
                if (file.is_open()) {
                    cout << "\n📖 Mood History:\n";
                    string line;
                    while (getline(file, line)) {
                        cout << line << endl;
                    }
                    file.close();
                } else {
                    cerr << "❌ Cannot open mood_log.txt\n";
                }
                break;
            }
            case 3:
                breathingExercise();
                break;
            case 4:
                showMotivation();
                break;
            case 5:
                cout << "👋 Goodbye! Take care of your mental health. 💚\n";
                break;
            default:
                cout << "❌ Invalid choice. Please try again.\n";
        }
    } while (choice != 5);

    return 0;
}
