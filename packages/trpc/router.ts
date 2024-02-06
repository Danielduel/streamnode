import { z } from "zod";
// @deno-types="npm:@trpc/server"
import { initTRPC } from "@trpc/server";
import * as base64 from "https://deno.land/std@0.207.0/encoding/base64.ts";
import * as hex from "https://deno.land/std@0.207.0/encoding/hex.ts";

const t = initTRPC.create({});

const tts = t.router({
  speak: t.procedure
    .input(z.object({
      message: z.string(),
    }))
    .query(async ({ input }) => {
      const voiceId = "onwK4e9ZLuTAKqWW03F9";
      const modelId = "";
      const pronunciationDictionaryId = "";
      const versionId = "";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": Deno.env.get("ELEVENLABS_APIKEY")!,
        },
        body: JSON.stringify({
          // "model_id": "<string>",
          // "pronunciation_dictionary_locators": [{
          //   "pronunciation_dictionary_id": "<string>",
          //   "version_id": "<string>",
          // }],
          "text": input.message,
          "voice_settings": {
            "similarity_boost": 1,
            "stability": 1,
            "style": 1,
            "use_speaker_boost": true,
          },
        }),
      };

      const ret = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        options,
      )
        .catch(console.error);

      if (ret) {
        const decoded = base64.encodeBase64(await ret.arrayBuffer());

        const asd = `data:${ret.headers.get("content-type")};base64,${decoded}`;
        console.log(asd);
        return asd;
      }

      return null;
    }),
});

export const appRouter = t.router({
  tts,
});

export type AppRouter = typeof appRouter;
