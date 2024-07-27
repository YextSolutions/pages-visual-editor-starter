import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import SiteLogo from "./SiteLogo";
import { useDocument } from "../hooks/useDocument";
import { PageSiteStream, PageStream } from "../types/autogen";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Once Site Stream is fixed, uncomment out this section -------------------------

  // // Use the name, c_header, and c_theme fields from the _site stream to render the header
  // const { name, c_header, c_theme }: PageSiteStream = useDocument<PageStream>(
  //   (document) => document._site
  // );
  //   ------------------------------------------------------------------------------

  // Once Site Stream is fixed, delete everything below this ------------------------
  const { c_linkedSites, name }: PageStream = useDocument<PageStream>(
    (document) => document
  );

  // const name = c_linkedSites[0].name;
  const c_header = c_linkedSites?.[0].c_header;
  const c_theme = c_linkedSites?.[0].c_theme;
  const navigation = c_header?.navigationList;

  // --------------------------------------------------------------------------------

  console.log("this is the name: ", name);
  console.log("this is the header: ", c_header);
  console.log("this is the theme: ", c_theme);
  console.log("this is the navigation: ", navigation);

  const headerClass =
    c_theme === "2" ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const navLinkClass =
    c_theme === "2"
      ? "text-white hover:bg-gray-700"
      : "text-gray-900 hover:bg-gray-50";
  const buttonClass = c_theme === "2" ? "text-white" : "text-gray-700";
  const chevronClass = c_theme === "2" ? "text-gray-300" : "text-gray-400";
  const overlayClass = c_theme === "2" ? "bg-gray-800 bg-opacity-50" : "";

  return (
    <header>
      <div className="flex justify-between items-center p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <SiteLogo />
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="#"
            className={`text-sm font-semibold leading-6 ${buttonClass}`}
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${buttonClass}`}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon
              aria-hidden="true"
              className={`h-6 w-6 ${buttonClass}`}
            />
          </button>
        </div>
      </div>

      {c_theme === "1" && (
        <div className="text-center text-2xl font-bold p-2 lg:text-4xl">
          {name}
        </div>
      )}

      <div className={`nav-section ${headerClass}`}>
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl justify-center p-6 lg:px-8"
        >
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
            {navigation?.map((navItem, index) => (
              <Popover className="relative" key={index}>
                <PopoverButton
                  className={`flex items-center gap-x-1 text-sm font-semibold leading-6 ${headerClass}`}
                >
                  {navItem.title}
                  {navItem.pages && navItem.pages.length > 0 && (
                    <ChevronDownIcon
                      aria-hidden="true"
                      className={`h-5 w-5 flex-none ${chevronClass}`}
                    />
                  )}
                </PopoverButton>

                {navItem.pages && navItem.pages.length > 0 && (
                  <PopoverPanel
                    transition
                    className={`absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl ${headerClass} shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in`}
                  >
                    <div className="p-4">
                      {navItem.pages.map((page, pageIndex) => (
                        <a
                          key={pageIndex}
                          href="#"
                          className={`block rounded-lg p-3 text-sm font-semibold leading-6 ${navLinkClass}`}
                        >
                          {page}
                        </a>
                      ))}
                    </div>
                  </PopoverPanel>
                )}
              </Popover>
            ))}
          </PopoverGroup>
        </nav>
      </div>
      <div className="relative">
        <img
          src="https://www.theladders.com/wp-content/uploads/handshake_190617.jpg"
          alt="Banner"
          className="w-full max-h-96 object-cover"
        />
        {c_theme === "2" && (
          <div
            className={`absolute inset-0 flex items-center justify-center ${overlayClass}`}
          >
            <span className="text-4xl font-bold text-white">{name}</span>
          </div>
        )}
      </div>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <SiteLogo />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation?.map((navItem, index) => (
                  <Disclosure as="div" className="-mx-3" key={index}>
                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      {navItem.title}
                      {navItem.pages && navItem.pages.length > 0 && (
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                        />
                      )}
                    </DisclosureButton>
                    {navItem.pages && navItem.pages.length > 0 && (
                      <DisclosurePanel className="mt-2 space-y-2">
                        {navItem.pages.map((page, pageIndex) => (
                          <DisclosureButton
                            key={pageIndex}
                            as="a"
                            href="#"
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {page}
                          </DisclosureButton>
                        ))}
                      </DisclosurePanel>
                    )}
                  </Disclosure>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Header;
