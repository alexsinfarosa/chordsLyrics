import type { ChordLyricsPair, Line } from "chordsheetjs";
import ChordSheetJS from "chordsheetjs";

const chordSheet = `
{title: Besame Mucho}
{artist: Consuelo Velázquez}
{key: Am}
{transpose: -4}

[Am7]Bésame,  bésame[Dm7/A] mucho,  como si [A7]fuera  esta [Dm7]noche  la[E7(b9)] última  [Am7]vez.
 
[A7(b9)]Bésame,    [A7]       bésame[D/F#] mucho, [Fm6]
 
[Am7]que tengo [C7/G]miedo a [B7/F#]perderte, [Fdim]perderte después. [E7(+5)]
 
 
[Am7]Bésame, bésame [Dm7/A]mucho,  [Bbm6]       [Dm7/A]como  si [A7]fuera esta [Dm7]noche la[E7b9] última  [Am7]vez.
 
[A7b9]Bésame,    [A7]      [A7b9] bésame[D/F#] mucho, [Fm6]`;

export default function Song() {
  const parser = new ChordSheetJS.ChordProParser();
  const song = parser.parse(chordSheet);
  console.log(song);
  console.log(song.bodyLines);
  return (
    <main>
      <h1 className="text-4xl">{song.title}</h1>
      <h2 className="font-semibold text-gray-600">{song.artist}</h2>
      <h3 className=" font-extrabold">Key: {song.key}</h3>

      <div className="mt-4">
        {song.bodyLines.map((line: Line, index: number) => {
          return (
            <div className="flex flex-row" key={index}>
              {line.items.map((pair: ChordLyricsPair) => {
                return (
                  <div className="flex flex-col">
                    <span className="text-2xl">{pair.chord}</span>
                    <span className="text-xl">{pair.lyrics}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </main>
  );
}
