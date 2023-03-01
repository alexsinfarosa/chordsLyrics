import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3CenterLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  EyeIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { supabase } from "~/utils/supabase";

import styles from "./tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Chords & Lyrics",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader() {
  const { data } = await supabase.from("songs").select("*");
  let songs: { id: string; title: string }[] = [];
  if (data) {
    songs = data.map((song) => ({ id: song.id, title: song.title }));
  }
  return { songs };
}

export default function App() {
  const { songs } = useLoaderData<typeof loader>();
  const [isList, setIsList] = useState(true);
  const [isView, setIsView] = useState(true);
  const [isEdit, setIsEdit] = useState(true);

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <>
          <div className="relative flex min-h-screen flex-col">
            {/* Navbar */}
            <Disclosure as="nav" className="flex-shrink-0 bg-indigo-600">
              {({ open }) => (
                <>
                  <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                      {/* Logo section */}
                      <div className="flex items-center px-2 lg:px-0 xl:w-64">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
                            alt="Your Company"
                          />
                        </div>
                      </div>

                      {/* Search section */}
                      <div className="flex flex-1 justify-center lg:justify-end">
                        <div className="w-full px-2 lg:px-6">
                          <label htmlFor="search" className="sr-only">
                            Search song
                          </label>
                          <div className="relative text-indigo-200 focus-within:text-slate-400">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <MagnifyingGlassIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              id="search"
                              name="search"
                              className="block w-full rounded-md border border-transparent bg-indigo-400 bg-opacity-25 py-2 pl-10 pr-3 leading-5 text-indigo-100 placeholder-indigo-200 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-sm"
                              placeholder="Search projects"
                              type="search"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex lg:hidden">
                        {/* Mobile menu button */}
                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-400 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <XMarkIcon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <Bars3CenterLeftIcon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </Disclosure.Button>
                      </div>
                      {/* Links section */}
                      <div className="hidden lg:block lg:w-80">
                        <div className="flex items-center justify-end">
                          <span className="isolate inline-flex rounded-md shadow-sm">
                            <button
                              type="button"
                              className={clsx(
                                "relative inline-flex items-center rounded-l-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              )}
                              onClick={() => setIsList(!isList)}
                            >
                              <span className="sr-only">List</span>
                              <ListBulletIcon
                                className={clsx(
                                  isList ? "text-indigo-600" : "",
                                  "h-5 w-5"
                                )}
                                aria-hidden="true"
                              ></ListBulletIcon>
                            </button>
                            <button
                              type="button"
                              className={clsx(
                                "relative -ml-px inline-flex items-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              )}
                              onClick={() => setIsView(!isView)}
                            >
                              <span className="sr-only">View</span>
                              <EyeIcon
                                className={clsx(
                                  isView ? "text-indigo-600" : "",
                                  "h-5 w-5"
                                )}
                                aria-hidden="true"
                              ></EyeIcon>
                            </button>
                            <button
                              type="button"
                              className={clsx(
                                "relative -ml-px inline-flex items-center rounded-r-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              )}
                              onClick={() => setIsEdit(!isEdit)}
                            >
                              <span className="sr-only">Edit</span>
                              <PencilSquareIcon
                                className={clsx(
                                  isEdit ? "text-indigo-600" : "",
                                  "h-5 w-5"
                                )}
                                aria-hidden="true"
                              ></PencilSquareIcon>
                            </button>
                          </span>
                          {/* Profile dropdown */}
                          <Menu
                            as="div"
                            className="relative ml-4 flex-shrink-0"
                          >
                            <div>
                              <Menu.Button className="flex rounded-full bg-indigo-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
                                <span className="sr-only">Open user menu</span>
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
                                  <span className="text-sm font-medium leading-none text-white">
                                    AS
                                  </span>
                                </span>
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="."
                                      className={clsx(
                                        active ? "bg-slate-100" : "",
                                        "block px-4 py-2 text-sm text-slate-700"
                                      )}
                                    >
                                      Logout
                                    </Link>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Disclosure.Panel className="lg:hidden">
                    <div className="px-2 pt-2 pb-3">
                      <Disclosure.Button
                        as="a"
                        href="#"
                        className="block rounded-md bg-indigo-800 px-3 py-2 text-base font-medium text-white"
                      >
                        Dashboard
                      </Disclosure.Button>
                      <Disclosure.Button
                        as="a"
                        href="#"
                        className="mt-1 block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-indigo-600 hover:text-indigo-100"
                      >
                        Support
                      </Disclosure.Button>
                    </div>
                    <div className="border-t border-indigo-800 pt-4 pb-3">
                      <div className="px-2">
                        <Disclosure.Button
                          as="a"
                          href="#"
                          className="mt-1 block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-indigo-600 hover:text-indigo-100"
                        >
                          Settings
                        </Disclosure.Button>
                        <Disclosure.Button
                          as="a"
                          href="#"
                          className="mt-1 block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-indigo-600 hover:text-indigo-100"
                        >
                          Sign out
                        </Disclosure.Button>
                      </div>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            {/* 3 column wrapper */}
            <div className="mx-auto w-full flex-grow lg:flex xl:px-8">
              {/* Left sidebar & main wrapper */}
              <div className="min-w-0 flex-1 bg-white xl:flex">
                {isList && (
                  <div className="border-b border-slate-200 bg-white xl:w-64 xl:flex-shrink-0 xl:border-b-0 xl:border-r xl:border-slate-200">
                    <div className="h-full py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                      {/* Left column area */}
                      <nav className="space-y-1" aria-label="Sidebar">
                        {songs.map((song) => (
                          <NavLink to={song.id} key={song.id}>
                            {({ isActive }) => (
                              <span
                                className={clsx(
                                  isActive
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                  "flex items-center rounded-md px-3 py-2 text-sm font-medium"
                                )}
                                aria-current={isActive ? "page" : undefined}
                              >
                                <span className="truncate">{song.title}</span>
                              </span>
                            )}
                          </NavLink>
                        ))}
                      </nav>
                    </div>
                  </div>
                )}
                <Outlet context={{ isView, isEdit }} />
              </div>
            </div>
          </div>
        </>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
