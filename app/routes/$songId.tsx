import type {ActionArgs, LoaderArgs} from '@remix-run/node'
import {Form, useLoaderData, useOutletContext} from '@remix-run/react'
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
  const [currentSong, setCurrentSong] = React.useState('')

  useEffect(() => {
    setCurrentSong(songRaw?.song || '')
  }, [songRaw])

  return (
    <PanelGroup direction="horizontal">
      {isView && (
        <Panel minSize={50} className="">
          <textarea
            readOnly
            className="h-full w-full resize-none border-none outline-0 focus:outline-0 focus:ring-0"
            value={formattedSong}
          />
        </Panel>
      )}
      {isView && isEdit && (
        <PanelResizeHandle className="border-2 border-slate-200" />
      )}
      {isEdit && (
        <Panel defaultSize={50} minSize={30} className="">
          <Form method="post" id="song-form">
            <textarea
              name="song"
              className="h-[calc(100vh-74px)] w-full resize-none overflow-auto border-none bg-slate-50 outline-0 focus:outline-0 focus:ring-0"
              value={currentSong}
              onChange={e => setCurrentSong(e.target.value)}
            />
          </Form>
        </Panel>
      )}
    </PanelGroup>
  )
}
