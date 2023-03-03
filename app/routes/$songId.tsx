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

export default function Song() {
  const {isEdit, isView} = useOutletContext<{
    isEdit: boolean
    isView: boolean
  }>()
  const {songRaw} = useLoaderData<typeof loader>()
  const parsedSong = new ChordSheetJS.ChordProParser().parse(
    songRaw?.song || '',
  )
  const formattedSong = new ChordSheetJS.TextFormatter().format(parsedSong)
  const [editSong, setEditSong] = React.useState<string | undefined>(
    songRaw?.song,
  )

  const navigation = useNavigation()
  const busy = navigation.state === 'submitting'

  const hasSongChanged = editSong !== songRaw?.song
  console.log({hasSongChanged})

  useEffect(() => {
    setEditSong(songRaw?.song)
  }, [songRaw])

  return (
    <PanelGroup autoSaveId="song-layout" direction="horizontal">
      {isView && (
        <Panel order={1} minSize={50} className="">
          <textarea
            readOnly
            className="h-full w-full resize-none border-none outline-0 focus:outline-0 focus:ring-0"
            value={formattedSong}
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
              // onMouseLeave={() => setEditSong(undefined)}
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

export function ErrorBoundary({error}) {
  return <div className="lg:px- py-6 px-4 sm:px-6">{error.message}</div>
}
