#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>
#include <limits>
using namespace std;

// USER CLASS
class User {
    string name;
    vector<string> moodHistory;

public:
    User(string username) {
        name = username;
    }

    string getName() {
        return name;
    }

    void addMood(string mood) {
        moodHistory.push_back(mood);
    }

    void showMoodHistory() {
        cout << "\n🧠 Mood History for " << name << ":\n";
        for (size_t i = 0; i < moodHistory.size(); ++i) {
            cout << "  " << i + 1 << ". " << moodHistory[i] << endl;
        }
    }
};

// MOOD TRACKER CLASS
class MoodTracker {
public:
    string askMood(User* user) {
        cout << "\n👋 Hi " << user->getName() << "! How are you feeling today?\n";
        cout << "Options: happy, sad, anxious, tired, excited, okay, idk\n➡️ Your mood: ";
        string ans;
        cin >> ans;
        return ans;
    }
};

// QUOTE PROVIDER CLASS
class QuoteProvider {
    vector<string> quotes;

public:
    QuoteProvider() {
        quotes = {
            "🌞 Keep shining, no matter what!",
            "🌱 Every day is a second chance.",
            "🔥 You are stronger than you think.",
            "💖 Breathe. Believe. Receive.",
            "🌈 This too shall pass."
        };
        srand(time(0));
    }

    void getRandomQuote() {
        int idx = rand() % quotes.size();
        cout << "\n💡 Motivational Quote: " << quotes[idx] << endl;
    }
};

// CALM ACTIVITY CLASS
class CalmActivity {
public:
    void stretchingExercise() {
        cout << "\n🧘‍♂️ Let's do a quick stretching exercise!\n";
        cout << "👉 Raise your hands above your head and stretch...\n";
        cout << "👉 Now gently bend side to side...\n";
        cout << "👉 Rotate your neck slowly in circles...\n";
        cout << "✅ Done! Great job stretching.\n";
    }

    void gratitudeExercise() {
        cout << "\n🙏 Let's do a gratitude check!\n";
        cout << "👉 Name one thing you're grateful for today: ";
        string grateful;
        cin.ignore(numeric_limits<streamsize>::max(), '\n'); // clear input buffer
        getline(cin, grateful);
        cout << "💖 That's beautiful! Gratitude makes us happier.\n";
    }
};

// ASSISTANT CLASS
class Assistant {
    User* obj = nullptr;
    MoodTracker mt;
    QuoteProvider qp;
    CalmActivity ca;

public:
    Assistant() {
        string name;
        cout << "👤 Enter your name: ";
        cin >> name;
        obj = new User(name);
    }

    void startSession() {
        string mood = mt.askMood(obj);
        obj->addMood(mood);
        qp.getRandomQuote();

        char choice;
        cout << "\nWould you like to do an activity? (y/n): ";
        cin >> choice;

        if (choice == 'y' || choice == 'Y') {
            int opt;
            cout << "\nChoose an activity:\n";
            cout << "1. Stretching Exercise\n";
            cout << "2. Gratitude Exercise\n";
            cout << "Enter choice (1/2): ";
            cin >> opt;

            if (opt == 1) {
                ca.stretchingExercise();
            } else if (opt == 2) {
                ca.gratitudeExercise();
            } else {
                cout << "❌ Invalid choice.\n";
            }
        }

        obj->showMoodHistory();
        cout << "\n🫶 Take care, " << obj->getName() << "! See you next time.\n";
    }

    ~Assistant() {
        delete obj;
    }
};

// MAIN FUNCTION
int main() {
    Assistant a;
    a.startSession();
    return 0;
}
