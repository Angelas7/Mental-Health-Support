#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
#include <ctime>

#ifdef _WIN32
    #include <windows.h>
    #define SLEEP_FUNC(x) Sleep(x * 1000)
#else
    #include <unistd.h>
    #define SLEEP_FUNC(x) sleep(x)
#endif

using namespace std;

// User class to store name and mood history
class User {
    string name;
    vector<string> moodHistory;

public:
    User(string name) : name(name) {}

    string getName() { return name; }

    void addMoodHistory(string mood) {
        moodHistory.push_back(mood);
    }

    void showMoodHistory() {
        cout << "\n📝 Mood History for " << name << ":\n";
        for (string mood : moodHistory) {
            cout << "- " << mood << endl;
        }
    }
};

// MoodTracker class
class MoodTracker {
public:
    string askMood(User* user) {
        cout << "\nHi " << user->getName() << ", how are you feeling today?\n";
        cout << "Options: happy, sad, anxious, tired, excited, okay, idk\n";
        string ans;
        cout << "Enter your mood: ";
        cin >> ans;
        return ans;
    }
};

// QuoteProvider class
class QuoteProvider {
    vector<string> quotes = {
        "Keep going, you're doing great!",
        "This too shall pass.",
        "You're stronger than you think.",
        "Every moment is a fresh beginning.",
        "Breathe in courage, breathe out fear."
    };

public:
    void getRandomQuote() {
        srand(time(0));
        int i = rand() % quotes.size();
        cout << "\n💡 Quote of the Day: " << quotes[i] << "\n";
    }
};

// CalmActivity class
class CalmActivity {
public:
    void breathingExercise() {
        cout << "\n🧘‍♀️ Starting Breathing Exercise...\n";
        for (int i = 0; i < 3; i++) {
            cout << "Breathe in...\n";
            SLEEP_FUNC(3);
            cout << "Hold...\n";
            SLEEP_FUNC(4);
            cout << "Breathe out...\n";
            SLEEP_FUNC(5);
            cout << "------\n";
        }
        cout << "Done! Hope you feel relaxed 😊\n";
    }

    void stretchExercise() {
        cout << "\n🤸 Starting Stretching Exercise...\n";
        for (int i = 0; i < 3; i++) {
            cout << "Stretch your arms...\n";
            SLEEP_FUNC(3);
            cout << "Hold the stretch...\n";
            SLEEP_FUNC(3);
            cout << "Relax...\n";
            SLEEP_FUNC(3);
            cout << "------\n";
        }
        cout << "Great work! 🧘‍♂️\n";
    }
};

// Assistant class to manage interaction
class Assistant {
    User* obj = nullptr;
    MoodTracker mt;
    QuoteProvider qp;
    CalmActivity ca;

public:
    Assistant() {
        string name;
        cout << "Enter your name: ";
        cin >> name;
        obj = new User(name);
    }

    void startSession() {
        string mood = mt.askMood(obj);
        obj->addMoodHistory(mood);
        qp.getRandomQuote();

        char choice;
        cout << "\nWould you like to do an exercise? (y/n): ";
        cin >> choice;

        if (choice == 'y' || choice == 'Y') {
            cout << "Select type of exercise:\n1. Breathing\n2. Stretching\nEnter choice (1/2): ";
            int exChoice;
            cin >> exChoice;
            if (exChoice == 1) {
                ca.breathingExercise();
            } else if (exChoice == 2) {
                ca.stretchExercise();
            } else {
                cout << "Invalid choice.\n";
            }
        }

        cout << "\nWould you like to see your mood history? (y/n): ";
        cin >> choice;
        if (choice == 'y' || choice == 'Y') {
            obj->showMoodHistory();
        }

        cout << "\nSession Ended. Take care! 🌈\n";
    }

    ~Assistant() {
        delete obj;
    }
};

// Main
int main() {
    Assistant assistant;
    assistant.startSession();
    return 0;
}