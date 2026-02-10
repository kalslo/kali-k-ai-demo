# Frequently Asked Questions (FAQ)

## General Questions

### What is Window?

Window is a gamified 24-hour day planner that helps you track your activities and their impact on three key daily stats: energy (0-100), food intake (meals and snacks), and mood. The app uses a visual time block grid to represent each hour of your day from midnight to midnight.

### Is Window free to use?

Yes! Window is a free, open-source day planner. All data is stored locally in your browser.

### Do I need to create an account?

No account needed! Window stores all data locally in your browser's localStorage. Just open the app and start planning.

### Can I use Window on my phone?

Yes! Window is responsive and works on mobile browsers. The interface adapts to different screen sizes.

### Where is my data stored?

All your data is stored locally in your browser's localStorage. Nothing is sent to external servers. Your data stays on your device.

## Using Window

### How do I add an activity?

Click any time block in the 24-hour grid. A form will appear where you can enter the activity name, select exertion level, and choose whether it's exerting or restorative. Click "add activity" to save.

### What's the difference between exerting and restorative activities?

- **Exerting activities** consume energy (work, exercise, chores, errands)
- **Restorative activities** restore energy (relaxing, meditation, hobbies, rest)

The same exertion level has opposite effects. For example, "high" exertion as exerting = -20 energy, but "high" as restorative = +20 energy.

### How do I choose the right exertion level?

Think about how demanding the activity is:

- **very low**: Passive activities (watching TV, light reading)
- **low**: Light effort (casual walk, cooking)
- **moderate**: Standard effort (work meetings, socializing, errands)
- **high**: Demanding (intense work, exercise, cleaning)
- **very high**: Maximum effort (intense workouts, moving, major projects)

Don't overthink it - approximate is fine!

### Can I edit or delete an activity?

Yes! Click on any existing activity to open it in edit mode. You can modify any details or click the delete button to remove it entirely.

### What happens when I delete an activity?

The activity is removed from that time block and your stats automatically recalculate to reflect the change.

### Can one activity span multiple hours?

Yes! You can log the same activity in multiple consecutive time blocks. Alternatively, use the Work Logger or Sleep Logger for quick multi-hour entries.

## Energy System

### How does energy work?

Energy starts at 0 each day and changes based on activities:

- **Sleep**: +15 energy per hour (max 100)
- **Exerting activities**: Consume energy (amount based on exertion level)
- **Restorative activities**: Restore energy (amount based on exertion level)

Your energy is capped at 100 points maximum.

### What does it mean when energy is below 20?

When your energy drops below 20 points, you'll see a warning. This suggests you should schedule some restorative activities or sleep to recover energy.

### Why did my energy go negative?

Energy can go below 0 if you log too many exerting activities without rest. This is a signal that you're overextending yourself!

### How much energy does sleep give me?

Sleep gives **+15 energy per hour**, up to a maximum of 100 total energy. So 7-8 hours of sleep is ideal to maximize your daily energy.

### Does the order of activities matter?

No, energy is calculated from all activities together. You can log activities in any order and your total energy will be the same.

### Can I have more than 100 energy?

No, energy is capped at 100. Even if you log activities that would give you 120 energy, you'll still only have 100.

## Food Tracking

### How does food tracking work?

Food is tracked separately from energy. Log meals and snacks throughout your day:

- **Meals** = +30 points each (breakfast, lunch, dinner)
- **Snacks** = +10 points each

Your daily goal is **3 meals + 1 snack** = 100 food points.

### Does food affect my energy?

No, food and energy are separate systems. Food tracking helps you maintain healthy eating habits, but it doesn't directly impact your energy level.

### What counts as a meal vs a snack?

- **Meal**: Full meals (breakfast, lunch, dinner)
- **Snack**: Smaller food items between meals

Use your best judgment! The goal is awareness, not perfection.

### Can I log more than 3 meals?

Yes! You can log as many meals and snacks as you want. The 3 meals + 1 snack goal is a recommended target, not a limit.

## Mood Tracking

### How do I update my mood?

Click the mood selector in the stats panel. Choose from 5 options: sad, mad, neutral, happy, or very happy.

### How often should I update my mood?

Update it whenever you feel your mood has changed. Some users update 2-3 times per day, others just once. Do what feels right!

### Does my mood affect my stats?

No, mood is tracked independently and doesn't directly affect energy or food. It's for your own awareness and pattern recognition.

### Can I see my mood history?

Yes! Navigate to previous days to see what mood you logged. This can help you identify patterns over time.

## Special Activities

### How do I log sleep?

You have two options:

1. **Sleep Logger** (recommended): Click quick actions → "log sleep" → enter bedtime and wake time
2. **Manual**: Add activities named "sleep" to each hour block

The app auto-detects sleep activities and applies the special sleep energy rule (+15/hour).

### How do I log meals?

Use the Food Logger for quick entry:

1. Click quick actions → "log food"
2. Choose meal or snack
3. Select the time
4. Submit

Or manually create activities with food-related names ("breakfast", "lunch", "snack").

### What is the Work Logger?

The Work Logger helps you quickly log multi-hour work sessions. Enter what you're working on, set start/end times, choose exertion level, and it creates work blocks for all those hours automatically.

### Can I create my own special activities?

The app automatically detects special activities based on names:

- Sleep: "sleep", "nap", "rest"
- Food: "breakfast", "lunch", "dinner", "snack", "meal"

Just use these keywords in your activity names!

## Day Navigation

### How do I view past days?

Use the date navigator at the top:

- Click **← Previous** to go back one day
- Click **→ Next** to go forward one day
- Click **Today** to return to the current day

### Can I jump to a specific date?

Currently, you can navigate day-by-day using the previous/next buttons. A date picker may be added in future updates!

### How far back is my history saved?

All your historical data is saved indefinitely in localStorage (unless you clear your browser data).

### What happens at midnight?

Window uses a midnight-to-midnight tracking system. When a new day begins, you start with fresh stats (0 energy, 0 meals, 0 snacks) and an empty time grid.

### Can I plan future days?

Yes! Navigate to future dates and add activities in advance. Great for planning your week ahead.

## Data Management

### Can I export my data?

Not yet, but this feature is planned! You'll be able to export all your data as JSON.

### What happens if I clear my browser data?

If you clear localStorage, all your Window data will be deleted. There's no cloud backup, so be careful!

### Can I use Window on multiple devices?

Each device stores data independently. Your data doesn't sync between devices. You'd need to use the same browser on the same device to see your data.

### Can I backup my data?

Currently, you can manually copy your localStorage data using browser dev tools. An easier backup/export feature is coming soon.

### Does Window work offline?

Yes! All functionality works offline since data is stored locally. No internet connection needed.

## Accessibility

### Is Window keyboard accessible?

Yes! You can navigate the entire app using only your keyboard:

- **Tab/Shift+Tab**: Navigate between elements
- **Enter/Space**: Activate buttons
- **Arrow keys**: Navigate dropdowns
- **Escape**: Close dialogs

### Does Window work with screen readers?

Yes! Window includes proper ARIA labels, semantic HTML, and screen reader announcements for dynamic content updates.

### Can I adjust text size?

Window respects your browser zoom level. Use browser zoom (Cmd/Ctrl +/-) to increase or decrease text size.

### Does Window support dark mode?

Not yet, but dark mode support is planned for a future release!

### What accessibility standards does Window meet?

Window aims to meet WCAG 2.1 Level AA standards for accessibility.

## Troubleshooting

### My activities aren't saving

- Check that JavaScript is enabled in your browser
- Ensure you're not in private/incognito mode (localStorage may not persist)
- Try refreshing the page
- Check browser console for errors

### My stats look wrong

- Stats are calculated automatically from all activities
- Try refreshing the page to recalculate
- Check that activities are logged correctly (exertion levels, types)
- Sleep activities should show "sleep" in the name

### The app is slow or laggy

- Try refreshing the page
- Clear old data if you have many months of history
- Check if other browser tabs are using resources
- Update to the latest browser version

### I can't click on time blocks

- Make sure you're clicking inside the time block area
- Check that JavaScript is enabled
- Try refreshing the page
- Ensure your browser is up to date

### Text is too small/large

- Use browser zoom (Cmd/Ctrl +/- or Ctrl + mouse wheel)
- Window's design adapts to your zoom level
- Check your browser's default font size settings

## Technical Questions

### What browsers are supported?

Window works on all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Does Window use cookies?

No! Window doesn't use cookies. All data is stored in localStorage.

### Is my data encrypted?

Data is stored in plain text in localStorage. Since it never leaves your device, transmission encryption isn't needed. Future versions may add local encryption.

### Can I contribute to Window?

Yes! Window is open source. Check the GitHub repository for contribution guidelines.

### What tech stack is Window built with?

Window uses:

- React 18 + TypeScript
- Vite (build tool)
- Vitest + React Testing Library (testing)
- CSS Modules (styling)
- localStorage (data persistence)

See [docs/tech-stack.md](./tech-stack.md) for complete details.

## Feature Requests

### Will there be data sync across devices?

This is a commonly requested feature! Cloud sync may be added in the future, but for now Window is local-only.

### Can you add tags or categories for activities?

Great idea! Activity tagging is on the roadmap.

### Will there be weekly/monthly views?

Calendar views and analytics are planned for future releases!

### Can I set custom goals?

Currently goals are fixed (20+ energy, 3 meals + 1 snack), but customizable goals may be added later.

### Will there be themes or customization?

Dark mode and theme customization are planned features!

### Can you add notifications or reminders?

Notification support is being considered for future versions.

---

## Still Have Questions?

If your question isn't answered here:

- Check the [User Guide](./USER_GUIDE.md) for detailed instructions
- Review the [documentation](../README.md) for technical details
- Open an issue on [GitHub](https://github.com/kalslo/kali-k-ai-demo/issues)

We're always happy to help! 🪟✨
