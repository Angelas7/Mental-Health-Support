#include <iostream>
#include <string>
#include <ctime>
#include <cstdlib>

using namespace std;

void showMenu();
void motivationalQuote();
void gratitudeExercise();
void stretchExercise();
void moodTracker();

void showMenu() {
    cout << "\n======= 🌟 Mental Health Support Menu 🌟 =======\n";
    cout << "1. Get a Motivational Quote 💬\n";
    cout << "2. Gratitude Exercise 🙏\n";
    cout << "3. Stretch Exercise 🧘‍♂️\n";
    cout << "4. Mood Tracker 📊\n";
    cout << "5. Exit 🚪\n";
    cout << "Enter your choice: ";
}

void motivationalQuote() {
    string quotes[] = {
        "🌈 'Keep going. Everything you need will come to you at the perfect time.'",
        "💪 'You are stronger than you think.'",
        "🌟 'Your mental health matters. Take care of yourself.'",
        "✨ 'Every day is a fresh start.'",
        "🌻 'You are not alone. You are loved and valued.'"
    };
    int n = sizeof(quotes) / sizeof(quotes[0]);
    int index = rand() % n;
    cout << "\n💖 Here's your motivational quote:\n" << quotes[index] << endl;
}

void gratitudeExercise() {
    cout << "\n🙏 Let's practice gratitude.\n";
    cout << "Think of 3 things you're thankful for today:\n";
    for (int i = 1; i <= 3; ++i) {
        string input;
        cout << "   " << i << ". ";
        getline(cin, input);
    }
    cout << "🌼 Wonderful! Gratitude helps build a happier mind.\n";
}

void stretchExercise() {
    cout << "\n🧘‍♂️ Let's do a quick stretch!\n";
    cout << "1. Raise your arms above your head and stretch tall... ⬆️\n";
    cout << "2. Now roll your shoulders slowly 5 times... 🔄\n";
    cout << "3. Gently twist your torso left and right... ↔️\n";
    cout << "4. Finally, relax your arms and take a deep breath... 😌\n";
    cout << "✅ Stretch complete! Feel a little more refreshed?\n";
}

void moodTracker() {
    string mood;
    cout << "\n📊 How are you feeling right now? (happy, sad, anxious, calm, etc.): ";
    getline(cin, mood);
    time_t now = time(0);
    char* dt = ctime(&now);
    cout << "📝 Mood '" << mood << "' recorded at " << dt;
}

int main() {
    srand(time(0));
    int choice;
    string pause; // for clearing input buffer

    do {
        showMenu();
        cin >> choice;
        cin.ignore(); // clear newline character after integer input

        switch (choice) {
            case 1:
                motivationalQuote();
                break;
            case 2:
                gratitudeExercise();
                break;
            case 3:
                stretchExercise();
                break;
            case 4:
                moodTracker();
                break;
            case 5:
                cout << "👋 Take care! See you next time.\n";
                break;
            default:
                cout << "⚠️ Invalid choice. Please try again.\n";
        }
    } while (choice != 5);

    return 0;
}
