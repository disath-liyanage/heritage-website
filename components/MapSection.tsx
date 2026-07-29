"use client";

import dynamic from "next/dynamic";
import { FaAirbnb, FaTripadvisor } from "react-icons/fa";
import { SiBookingdotcom } from "react-icons/si";

const center = { lat: 6.9271, lng: 80.3849 };

type ClientMapProps = {
  apiKey: string;
};

const ClientMap = dynamic<ClientMapProps>(
  async () => {
    const { GoogleMap, Marker, InfoWindow, useJsApiLoader } = await import("@react-google-maps/api");

    return function ClientMapInner({ apiKey }: ClientMapProps) {
      const { isLoaded, loadError } = useJsApiLoader({
        id: "heritage-map",
        googleMapsApiKey: apiKey,
      });

      if (loadError) {
        return (
          <div className="flex h-112.5 items-center justify-center text-center text-[#5A674F]">
            Unable to load Google Maps right now.
          </div>
        );
      }

      if (!isLoaded) {
        return <div className="flex h-112.5 items-center justify-center text-[#5A674F]">Loading map...</div>;
      }

      return (
        <>
          <style>{`
            .gm-ui-hover-effect {
              display: none !important;
            }
            .gm-style-iw-d {
              padding-right: 0 !important; 
            }
          `}</style>

          <GoogleMap
            mapContainerStyle={{ 
              width: "100%", 
              height: "450px",
              borderRadius: "1.5rem" 
            }}
            center={center}
            zoom={14}
            options={{
              zoomControl: true,
              scrollwheel: true,
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker position={center} />

            <InfoWindow 
              position={center} 
              options={{ 
                pixelOffset: new window.google.maps.Size(0, -35),
                disableAutoPan: true
              }}
            >
              <div className="flex flex-col gap-1 p-1 text-[#1C2B1E] min-w-[200px]">
                <span className="text-sm font-bold">
                  Heritage Family Restaurant
                </span>
                <span className="text-xs font-normal text-[#5A674F]">
                  A7, Thunkinda, Yatiyanthota
                </span>
                <span className="text-xs font-normal text-[#5A674F]">
                  Sri Lanka 71724
                </span>
                <a 
                  href="https://maps.app.goo.gl/XyKPGNf9t7nHyNrf6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline inline-block w-max"
                >
                  View on Google Maps
                </a>
              </div>
            </InfoWindow>
          </GoogleMap>
        </>
      );
    };
  },
  {
    ssr: false,
    loading: () => <div className="flex h-112.5 items-center justify-center text-[#5A674F]">Loading map...</div>,
  }
);

export default function MapSection() {
  const mapsApiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim();

  return (
    <section id="find" className="bg-[#F5F0E8] pt-20" aria-label="Location section">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-4xl text-[#1C2B1E] md:text-5xl text-center">Find us on Google Maps</h2>

        <div className="mt-8 overflow-hidden rounded-3xl border border-[#DDCFB9] bg-[#EDE5D8]">
          {!mapsApiKey ? (
            <div className="flex h-112.5 items-center justify-center text-center text-[#5A674F] p-6">
              Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in deployment settings to load the map.
            </div>
          ) : (
            <ClientMap apiKey={mapsApiKey} />
          )}
        </div>

        <div className="mx-auto max-w-4xl pt-16 text-center">
          <h2 className="text-4xl font-display text-[#1F2D21] mb-8">Reserve Your Stay</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a href="https://www.booking.com/hotel/lk/the-magical-tree-house.en-gb.html" target="_blank" rel="noreferrer" className="group flex items-center gap-2 bg-[#003B95] px-6 py-3 rounded-full text-white hover:bg-[#002b6e] transition-all text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <SiBookingdotcom className="w-5 h-5" />
              Booking.com
            </a>

            <a href="https://www.airbnb.com/rooms/1475264680546928390" target="_blank" rel="noreferrer" className="group flex items-center gap-2 bg-[#FF5A5F] px-6 py-3 rounded-full text-white hover:bg-[#E04E53] transition-all text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <FaAirbnb className="w-5 h-5" />
              Airbnb
            </a>

            <a href="https://www.tripadvisor.com/Restaurant_Review-g26500862-d16898051-Reviews-Heritage_Family_Restaurant-Hakbellawaka_Sabaragamuwa_Province.html" target="_blank" rel="noreferrer" className="group flex items-center gap-2 bg-[#00AF87] px-6 py-3 rounded-full text-white hover:bg-[#008C6C] transition-all text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <FaTripadvisor className="w-5 h-5" />
              TripAdvisor
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://wa.me/94716939224" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[#2E4830] hover:text-[#1F2D21] transition-colors font-semibold">
              <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <span className="text-[#D5C9B3] hidden sm:inline">|</span>
            <a href="tel:+94716939224" className="group flex items-center gap-2 text-[#2E4830] hover:text-[#1F2D21] transition-colors font-semibold">
              <svg className="w-5 h-5 text-[#2E4830]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              +94 71 693 9224
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}