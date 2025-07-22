#include <iostream>
#include <fstream>
#include <string>
#include <ctime>
#include <iomanip>
#include <thread>
#include <chrono>

using namespace std;

void logEntry(const string& entry) {
    ofstream logFile("calm_log.txt", ios::app);
    if (logFile.is_open()) {
        time_t now = time(0);
        tm* ltm = localtime(&now);
        logFile << "[" << put_time(ltm, "%Y-%m-%d %H:%M:%S") << "] " << entry << "\n";
        logFile.close();
    } else {
        cerr << "❌ Unable to open log file." << endl;
    }
}

void breathingExercise() {
    cout << "\n🫁 Starting a calming breathing exercise...\n\n";

    for (int i = 0; i < 3; ++i) {
        cout << "🫧 Inhale..." << endl;
        this_thread::sleep_for(chrono::seconds(4));

        cout << "⏸️ Hold..." << endl;
        this_thread::sleep_for(chrono::seconds(4));

        cout << "💨 Exhale..." << endl;
        this_thread::sleep_for(chrono::seconds(4));

        cout << endl;
    }

    cout << "✅ Exercise complete. Feeling better? 😊" << endl;
    logEntry("Completed a breathing exercise.");
}

void gratitudeNote() {
    cin.ignore(); // Clear leftover newline
    string note;
    cout << "\n🙏 What is one thing you're grateful for today?\n> ";
    getline(cin, note);
    logEntry("Gratitude: " + note);
    cout << "💛 Logged. Practicing gratitude helps shift your mood.\n";
}

void positiveAffirmation() {
    cout << "\n🌞 Here's a positive affirmation for you:\n";
    cout << "\"I am doing my best, and that is enough.\"\n";
    logEntry("Read positive affirmation.");
}

int main() {
    int choice;

    this_thread::sleep_for(chrono::seconds(1));
    cout << "🧘‍♀️ Welcome to Calmin — Your Mental Wellness Companion 🧘‍♂️\n";

    do {
        cout << "\n🔹 Choose an option:\n";
        cout << "1. Breathing Exercise\n";
        cout << "2. Write a Gratitude Note\n";
        cout << "3. Get a Positive Affirmation\n";
        cout << "4. Exit\n";
        cout << "👉 Enter your choice: ";
        cin >> choice;

        if (cin.fail()) {
            cin.clear();  // clear the error flag
            cin.ignore(numeric_limits<streamsize>::max(), '\n');  // discard invalid input
            cout << "❌ Please enter a valid number between 1 and 4.\n";
            continue;
        }

        switch (choice) {
            case 1:
                breathingExercise();
                break;
            case 2:
                gratitudeNote();
                break;
            case 3:
                positiveAffirmation();
                break;
            case 4:
                cout << "👋 Take care! Come back anytime you need a calm moment.\n";
                break;
            default:
                cout << "❌ Invalid choice. Please try again.\n";
        }

    } while (choice != 4);

    return 0;
}
