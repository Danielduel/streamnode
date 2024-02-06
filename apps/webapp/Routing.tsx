import { Route, Routes } from "react-router-dom";

import { ChatClient } from "@twurple/chat";
import { webappTrpc } from "@/packages/trpc/trpc-webapp.ts";

const secondOfSilence =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

const play = (src: string) => {
  const audioElement: HTMLAudioElement = document.getElementById("test")!;
  audioElement.src = src;
  audioElement.play();
};

if (("document" in globalThis)) {
  setInterval(() => {
    console.log("Playing a sec");
    play(secondOfSilence);
  }, 10000);
}

const Page = () => {
  return (
    <div>
      Hello
      <audio id="test" />
    </div>
  );
};

export const Routing = () => {
  return (
    <Routes>
      <Route index element={<Page />} />
    </Routes>
  );
};

const localStorageOrPrompt = (key: string, promptText: string) => {
  const value = localStorage.getItem(key);
  if (!value) {
    const prompted = prompt(promptText) ?? "";
    localStorage.setItem(key, prompted);
    return prompted;
  }
  return value;
};

try {
  (async () => {
    if (!("document" in globalThis)) return;

    const channelName = localStorageOrPrompt(
      "channelName",
      "What is your channel name? (lowercase, without # prefix, f.e. mine is danielduel)",
    );
    const chatClient = new ChatClient();
    chatClient.irc.addCapability({
      name: "twitch.tv/membership",
    });
    chatClient.irc.addCapability({
      name: "twitch.tv/tags",
    });

    chatClient.onJoin((twitchChannelName, twitchUserName) => {
      console.log("Hello");
    });

    chatClient.onPart((twitchChannelName, twitchUserName) => {
    });

    chatClient.onJoinFailure((twitchChannelName, twitchUserName) => {});

    // chatClient.irc.onTypedMessage(
    //   MessageTypes.Numerics.Reply353NamesReply,
    //   (msg) => {
    //     msg.names.value.split(" ").forEach((twitchUserName) => {
    //     });
    //   },
    // );

    chatClient.irc.onDisconnect(() => {
      chatClient.reconnect();
    });

    let lastChatter = "";
    chatClient.onMessage(
      async (twitchChannelName, twitchUserName, messageText, messageData) => {
        if (messageText.length > 200) return;
        if (messageText.startsWith("!")) return;
        if (messageText.startsWith("@")) return;

        let message = `${twitchUserName}, ${messageText}`;
        if (lastChatter === twitchUserName) {
          message = messageText;
        }

        const response = await webappTrpc.tts.speak.query({
          message,
        });
        if (response) {
          play(response);
        }
      },
    );

    await chatClient.connect();
    await chatClient.join(channelName);
  })();
} catch (err) {
  console.error(err);
}
