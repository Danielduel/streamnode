import { Route, Routes } from "react-router-dom";

// @deno-types="npm:@twurple/chat"
import { ChatClient } from "@twurple/chat";
import { webappTrpc } from "@/packages/trpc/trpc-webapp.ts";
import { useEffect } from "react";

const secondOfSilence =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
const beep =
  "data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=";

let playBusy = false;

if ("Audio" in globalThis) {
  (new Audio()).play()
    .then(console.log)
    .catch(() => {
      playBusy = true;
      alert("Allow audio for this website, see the browser's address bar");
      location.reload();
    });
}

const playQueue: string[] = [];
const play = async (src: string) => {
  playQueue.push(src);
  if (playBusy) {
    return;
  }
  playBusy = true;

  const audioElement: HTMLAudioElement = document.getElementById(
    "audioplayer",
  )! as HTMLAudioElement;

  const playP = (src: string) =>
    new Promise((r) => {
      try {
        audioElement.src = src;
        audioElement.onended = r;
        audioElement.onerror = console.log;
        audioElement.play();
      } catch (error) {
        console.log("Errro!", error);
      }
    });

  let item: string | undefined = playQueue.shift();
  while (item) {
    await playP(item);
    item = playQueue.shift();
  }

  playBusy = false;
};

if (("document" in globalThis)) {
  setInterval(() => {
    console.log("Playing a sec");
    play(secondOfSilence);
  }, 10000);
}

const Page = () => {
  useEffect(() => {
    play(secondOfSilence);
  });
  return (
    <div>
      <audio className="w-screen" controls id="audioplayer" autoPlay />
      Hello
      <button
        className="ring p-3 m-2 cursor-pointer"
        onClick={() => {
          play(beep);
        }}
      >
        Do test beep
      </button>
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

const run = <T,>(x?: () => T) => x?.();

const createPlayer = () => {
  if (!("document" in globalThis)) return;
  const channelName = localStorageOrPrompt(
    "channelName",
    "What is your channel name? (lowercase, without # prefix, f.e. mine is danielduel)",
  );
  const id = localStorageOrPrompt(
    "id",
    "What is your id? (ask the author)",
  );

  return () =>
    new Promise((resolve, reject) => {
      try {
        const chatClient = new ChatClient();
        chatClient.irc.addCapability({
          name: "twitch.tv/membership",
        });
        chatClient.irc.addCapability({
          name: "twitch.tv/tags",
        });
        chatClient.onJoin((twitchChannelName, twitchUserName) => {});
        chatClient.onPart((twitchChannelName, twitchUserName) => {});
        chatClient.onJoinFailure((twitchChannelName, twitchUserName) => {});
        // chatClient.irc.onTypedMessage(
        //   MessageTypes.Numerics.Reply353NamesReply,
        //   (msg) => {
        //     msg.names.value.split(" ").forEach((twitchUserName) => {
        //     });
        //   },
        // );
        chatClient.irc.onDisconnect(() => {});
        let lastChatter = "";
        chatClient.onMessage(
          async (
            twitchChannelName,
            twitchUserName,
            messageText,
            messageData,
          ) => {
            if (messageText.length > 200) return;
            if (messageText.startsWith("!")) return;
            if (messageText.startsWith("@")) return;
            if (twitchUserName === "streamelements") return;

            let message = `${twitchUserName}, ${messageText}`;
            if (lastChatter === twitchUserName) {
              message = messageText;
            }
            lastChatter = twitchUserName;

            const response = await webappTrpc.tts.speak.query({
              message,
              id,
            });
            if (response) {
              play(response);
            }
          },
        );
        chatClient.connect();
        chatClient.join(channelName);
      } catch (err) {
        setTimeout(() => {
          reject(err);
        }, 3000);
      }
    });
};

if ("document" in globalThis) {
  (async () => {
    const _createPlayer = createPlayer();
    while (_createPlayer) {
      try {
        await run(_createPlayer);
      } catch (err) {
        console.error(err);
      }
    }
  })();
}
