"use client";

import dynamic from "next/dynamic";

const center = { lat: 6.9271, lng: 80.3849 };

type ClientMapProps = {
  apiKey: string;
};

const ClientMap = dynamic<ClientMapProps>(
  async () => {
    const { GoogleMap, Marker, useJsApiLoader } = await import("@react-google-maps/api");

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
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "450px" }}
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
          <Marker position={center} label="Heritage Family Restaurant" />
        </GoogleMap>
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
    <section id="location" className="bg-[#F5F0E8] py-20" aria-label="Location section">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-4xl text-[#1C2B1E] md:text-5xl">Find us in Yatiyanthota</h2>
        <p className="mt-3 text-[#5A674F]">
          Thunkinda, Yatiyanthota, near Kithulgala, Sri Lanka - beside the Kelani River
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-[#DDCFB9] bg-[#EDE5D8]">
          {!mapsApiKey ? (
            <div className="flex h-112.5 items-center justify-center text-center text-[#5A674F]">
              Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in deployment settings to load the map.
            </div>
          ) : (
            <ClientMap apiKey={mapsApiKey} />
          )}
        </div>

        <div id="contact" className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-[#DDCFB9] bg-white p-5">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[#8A7A61]">Address</h3>
            <p className="mt-2 text-[#2D3F2B]">Thunkinda, Yatiyanthota, near Kithulgala, Sri Lanka</p>
          </article>
          <article className="rounded-lg border border-[#DDCFB9] bg-white p-5">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[#8A7A61]">Phone</h3>
            <p className="mt-2 text-[#2D3F2B]">+94 71 693 9224</p>
          </article>
          <article className="rounded-lg border border-[#DDCFB9] bg-white p-5">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[#8A7A61]">Hours</h3>
            <p className="mt-2 text-[#2D3F2B]">Lunch 12pm-3pm · Dinner 6pm-10pm · Open Daily</p>
          </article>
        </div>
      </div>
    </section>
  );
}
