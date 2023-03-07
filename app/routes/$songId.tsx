import type {ActionArgs, LoaderArgs} from '@remix-run/node'
import {
  Form,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from '@remix-run/react'
import ChordSheetJS from 'chordsheetjs'
import React, {useEffect} from 'react'
import {Panel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels'
import invariant from 'tiny-invariant'
import {supabase} from '~/utils/supabase'

export async function action({params, request}: ActionArgs) {
  invariant(params.songId, 'songId not found')

  const songRecord = await supabase
    .from('songs')
    .select('*')
    .eq('id', params.songId)
    .single()
  if (!songRecord) {
    throw new Error('Song not found')
  }

  const formData = await request.formData()
  const song = Object.fromEntries(formData)

  const {error} = await supabase
    .from('songs')
    .update(song)
    .eq('id', params.songId)
  if (error) {
    throw new Error(error.message)
  }

  return null
}

export async function loader({params}: LoaderArgs) {
  invariant(params.songId, 'songId not found')
  const songRaw = await supabase
    .from('songs')
    .select('*')
    .eq('id', params.songId)
    .single()

  if (songRaw.status !== 200) {
    throw new Error('Song not found')
  }

  return {songRaw: songRaw.data}
}

const chord = `text-sm font-semibold text-black`
const chorus = `bg-white`

export default function Song() {
  const {isEdit, isView} = useOutletContext<{
    isEdit: boolean
    isView: boolean
  }>()
  const {songRaw} = useLoaderData<typeof loader>()
  const parsedSong = new ChordSheetJS.ChordProParser().parse(
    songRaw?.song || '',
  )
  // console.log(parsedSong)
  // const formattedSong = new ChordSheetJS.TextFormatter().format(parsedSong)
  const formattedSong = new ChordSheetJS.HtmlTableFormatter()
    .format(parsedSong)
    .replaceAll(/class="chord"/g, `class="${chord}"`)

  const [hasSongChanged, setHasSongChanged] = React.useState(false)
  const [editSong, setEditSong] = React.useState<string | undefined>()

  const navigation = useNavigation()
  const busy = navigation.state === 'submitting'

  function handleOnSelect() {
    if (songRaw?.song === editSong) {
      setHasSongChanged(false)
    } else {
      setHasSongChanged(true)
    }
  }

  useEffect(() => {
    setEditSong(songRaw?.song)
  }, [songRaw])

  return (
    <PanelGroup autoSaveId="song-layout" direction="horizontal">
      {isView && (
        <Panel order={1} minSize={50} className="">
          {/* <textarea
            readOnly
            className="h-full w-full resize-none border-none outline-0 focus:outline-0 focus:ring-0"
            value={formattedSong}
          /> */}
          <article
            className="prose prose-tr:border-b-0 px-4 prose-table:bg-slate-50  prose-h2:text-base prose-h2:text-gray-500 prose-h1:text-2xl prose-h2:mt-0 max-w-[478px]"
            dangerouslySetInnerHTML={{__html: formattedSong}}
          />
        </Panel>
      )}
      {isView && isEdit && (
        <PanelResizeHandle className="border-2 border-slate-100" />
      )}
      {isEdit && (
        <Panel
          order={2}
          defaultSize={50}
          minSize={30}
          collapsible
          className="relative"
        >
          <Form method="post">
            <textarea
              className="h-[calc(100vh-74px)] w-full resize-none overflow-auto border-none outline-0 focus:outline-0 focus:ring-0"
              name="song"
              value={editSong}
              onChange={e => setEditSong(e.target.value)}
              onSelect={handleOnSelect}
              spellCheck="false"
            />

            {hasSongChanged && (
              <button
                type="submit"
                className=" absolute top-2 right-2 inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {busy ? 'Saving' : 'Save'}
              </button>
            )}
          </Form>
        </Panel>
      )}
    </PanelGroup>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  return <div className="lg:px- py-6 px-4 sm:px-6">{error.message}</div>
}
