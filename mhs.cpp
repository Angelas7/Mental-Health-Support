#include <iostream>
#include <fstream>
#include <ctime>
#include <string>
#include <vector>
#include <cstdlib>
#include <thread>     // for sleep
#include <chrono>     // for seconds

using namespace std;

// Function to get current time and date as string
string getCurrentDateTime() {
    time_t now = time(0);
    char buf[80];
    strftime(buf, sizeof(buf), "%Y-%m-%d %X", localtime(&now));
    return string(buf);
}

// Function to track and save mood
void trackMood() {
    string mood;
    cout << "\n💬 How are you feeling today? ";
    getline(cin, mood);

    ofstream file("mood_log.txt", ios::app);
    if (file.is_open()) {
        file << getCurrentDateTime() << " - Mood: " << mood << endl;
        file.close();
        cout << "✅ Mood saved successfully!\n";
    } else {
        cerr << "❌ Error opening mood_log.txt\n";
    }
}

// Function to show a motivational quote
void showQuote() {
    vector<string> quotes = {
        "🌟 Keep going, you're doing great!",
        "💪 You are stronger than you think.",
        "🌈 Every day is a fresh start.",
        "🧠 Mental health matters. Take care of yourself.",
        "☀️ Breathe. Relax. You've got this."
    };

    int index = rand() % quotes.size();
    cout << "\n🧘 Motivational Quote:\n";
    cout << "\"" << quotes[index] << "\"\n";
}

// Function to guide breathing exercise

int main() {
    srand(time(0)); // Seed for random quotes
    int choice;

    do {
        cout << "\n====== 🧘 Mental Health Support Tool ======\n";
        cout << "1. Track Mood\n";
        cout << "2. Show Motivational Quote\n";
        cout << "3. Breathing Exercise\n";
        cout << "4. Exit\n";
        cout << "Enter your choice (1-4): ";
        cin >> choice;
        cin.ignore();  // To handle newline after choice

        switch (choice) {
            case 1:
                trackMood();
                break;
            case 2:
                showQuote();
                break;
            //case 3:
               // breathingExercise();
              //  break;
            case 3:
                cout << "👋 Take care! See you again.\n";
                break;
            default:
                cout << "❗ Invalid choice. Try again.\n";
        }
    } while (choice != 3);

    return 0;
}
