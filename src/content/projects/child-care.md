---
title: Child Care - CyberSoul
summary: Mobile app that guides parents of children with ADHD through AI-led conversations and turns them into PDF reports for psychologists.
date: 2024-12-08
order: 3
featured: false
status: Archived
role: Fullstack Software Engineer (Mobile)
duration: 4 months so far
techStack: [Flutter, Gemini API, Firebase, Figma, Google Authentication]
repoUrl: https://github.com/perdidev/childcare # TODO: replace with the real repository
thumbnail:
  image: ../../assets/projects/child-care/screenshot-1.png
  alt: Three phone screens of the ChildCare app showing the home page, the community feed and the tips page
screenshots:
  - image: ../../assets/projects/child-care/screenshot-1.png
    alt: Three phone screens side by side, the Beranda home page with a Bincang dengan anak dipandu AI card, the Komunitas feed and the Tips page
    caption: The main tabs, the home page with the AI-guided conversation entry, the parent community and treatment tips.
  - image: ../../assets/projects/child-care/screenshot-2.png
    alt: Beranda home page with a Mulai button, Daftar anak and Riwayat Percakapan sections, next to the FAQs page explaining the AI feature
    caption: Parents start a conversation from the home page, pick a child and review past conversations. The FAQs explain how the AI flow works.
  - image: ../../assets/projects/child-care/screenshot-3.png
    alt: Profil page with menu items for account details, privacy, FAQs, contact and about, next to the Detail Aplikasi page with the ChildCare logo and team credits
    caption: The profile tab holds account settings, privacy, FAQs and the about page with the CyberSoul team credits.
challenges:
  - challenge: Children with ADHD often lose focus quickly, and parents are not sure which questions will help them open up.
    solution: The parent writes down what they are worried about, and the Gemini API suggests a question based on a psychology approach. After the parent types the child's answer, the AI asks a follow-up question, and this repeats until the parent decides the conversation is long enough.
  - challenge: A conversation on a phone is hard to hand over to a psychologist or psychiatrist.
    solution: Each finished conversation is saved to the child's history and can be exported and shared as a PDF from the child's detail page, so the professional gets the full exchange and the AI insight in one document.
  - challenge: One parent may care for more than one child, and each child's history must stay separate.
    solution: Parents register each child once (Daftar anak), and every conversation is stored under that child in Firebase, behind Google sign-in.
learned:
  - Prompts for sensitive topics need careful wording, because the AI's tone reaches a child through the parent.
  - The output that matters most is the one a professional can read, so the PDF export was as important as the chat.
  - Designing in Figma first made it easier for the team to agree on the flow before writing Flutter code.
outcome: Built by Tim CyberSoul from Universitas Hasanuddin, with Muh. Fayzul Haq as team lead, Ni Made Dwi Jayanti as system analyst and me as developer. Version 1.0.0 covers AI-guided conversations, PDF sharing, a parent community and treatment tips.
relatedPosts: []
---

**ChildCare** is an Android app that helps parents of children with ADHD talk with their child and get psychological insight from those conversations. It was built by **Tim CyberSoul** from **Universitas Hasanuddin**.

### How It Works

1. The parent picks a child and describes what they are concerned about.
2. The AI suggests a question to ask the child, using a psychology-based approach.
3. The parent asks the question and types the child's answer into the app.
4. The AI replies with a follow-up question. This continues until the parent feels the conversation is complete.
5. The conversation is saved as a PDF that the parent can share with a psychologist or psychiatrist.

### Key Features

**Beranda (home)**: Greets the parent, starts an AI-guided conversation (Bincang dengan anak dipandu AI), lists registered children (Daftar anak) and shows the conversation history (Riwayat Percakapan).

**Komunitas**: A feed where parents share stories, with a button to create a new post.

**Tips**: Treatment ideas that parents can try with their child, such as puzzles, card matching, games and journaling.

**Profil**: Account details, privacy, FAQs, contact and information about the app.

### Technology Stack

The app is written in **Flutter**. Conversations are powered by the **Gemini API**. Data is stored in **Firebase**, and users sign in with **Google Authentication**. The UI was designed in **Figma**.
