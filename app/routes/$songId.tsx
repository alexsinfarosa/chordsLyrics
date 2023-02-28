import type {ActionArgs, LoaderArgs} from '@remix-run/node'
import {Form, useLoaderData, useOutletContext} from '@remix-run/react'
import ChordSheetJS from 'chordsheetjs'
import React, {useEffect} from 'react'
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
    <>
      {isView && (
        <div className="bg-white lg:min-w-0 lg:flex-1">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Main area */}
            <textarea
              readOnly
              className="h-screen w-full resize-none border-none outline-0 focus:outline-0 focus:ring-0"
              value={formattedSong}
            />
          </div>
        </div>
      )}

      {isEdit && (
        <div className="bg-indigo-50 pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-slate-200 lg:pr-8 xl:pr-0">
          <div className="h-full py-6 pl-6 lg:w-80">
            {/* Right column area */}
            <Form method="post" id="song-form">
              <textarea
                name="song"
                className="h-screen w-full resize-none border-none outline-0 focus:outline-0 focus:ring-0"
                value={currentSong}
                onChange={e => setCurrentSong(e.target.value)}
              />
            </Form>
          </div>
        </div>
      )}
    </>
  )
}
