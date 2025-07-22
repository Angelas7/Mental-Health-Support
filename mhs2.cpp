#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <vector>

using namespace std;
using namespace std::chrono;

// Function to simulate waiting
void wait(int seconds) {
    this_thread::sleep_for(seconds_cast<seconds>(seconds));
}

// Stretching Exercise
void stretchExercise() {
    cout << "\n🧘 Let's do a quick stretching exercise:\n";
    cout << "1️⃣ Raise your hands above your head and stretch.\n";
    wait(3);
    cout << "2️⃣ Bend to the left...\n";
    wait(2);
    cout << "3️⃣ Bend to the right...\n";
    wait(2);
    cout << "4️⃣ Roll your shoulders...\n";
    wait(2);
    cout << "✅ Done! Great job stretching! 💪\n";
}

// Gratitude Exercise
void gratitudeExercise() {
    cout << "\n💖 Let's practice gratitude.\n";
    vector<string> prompts = {
        "🙏 Name one thing you're grateful for today: ",
        "😊 Name one person who made you smile recently: ",
        "🌟 Name one personal strength you’re proud of: "
    };

    string response;
    for (string prompt : prompts) {
        cout << prompt;
        getline(cin, response);
        cout << "✨ Noted: " << response << "\n";
    }

    cout << "✅ Beautiful! Gratitude makes the heart full. 🌈\n";
}

// Breathing Exercise
void breathingExercise() {
    cout << "\n🧘‍♀️ Let's begin a calming breathing exercise...\n";
    for (int i = 0; i < 3; ++i) {
        cout << "🫁 Breathe in...\n";
        this_thread::sleep_for(chrono::seconds(4));

        cout << "😮‍💨 Hold...\n";
        this_thread::sleep_for(chrono::seconds(4));

        cout << "🌬️ Breathe out...\n";
        this_thread::sleep_for(chrono::seconds(4));
    }
    cout << "✅ Exercise complete! Feel better already? 🌈\n";
}

// Main Menu
int main() {
    int choice;
    do {
        cout << "\n🔹 Mental Health Simulator Menu 🔹\n";
        cout << "1. Stretch Exercise\n";
        cout << "2. Gratitude Exercise\n";
        cout << "3. Breathing Exercise\n";
        cout << "0. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;
        cin.ignore(); // flush newline after integer input

        switch (choice) {
            case 1:
                stretchExercise();
                break;
            case 2:
                gratitudeExercise();
                break;
            case 3:
                breathingExercise();
                break;
            case 0:
                cout << "👋 Goodbye! Stay mentally strong! 💖\n";
                break;
            default:
                cout << "❌ Invalid choice. Try again.\n";
        }

    } while (choice != 0);

    return 0;
}
