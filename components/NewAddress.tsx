"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { saveAddressDB } from "@/lib/supabase/actions/address.actions";
import { Search, ChevronDown, MapPin, Phone, Home, Globe } from "lucide-react";

const ALL_COUNTRIES = [
  { region: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { region: "Albania", code: "+355", flag: "🇦🇱" },
  { region: "Algeria", code: "+213", flag: "🇩🇿" },
  { region: "Andorra", code: "+376", flag: "🇦🇩" },
  { region: "Angola", code: "+244", flag: "🇦🇴" },
  { region: "Argentina", code: "+54", flag: "🇦🇷" },
  { region: "Armenia", code: "+374", flag: "🇦🇲" },
  { region: "Australia", code: "+61", flag: "🇦🇺" },
  { region: "Austria", code: "+43", flag: "🇦🇹" },
  { region: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { region: "Bahamas", code: "+1-242", flag: "🇧🇸" },
  { region: "Bahrain", code: "+973", flag: "🇧🇭" },
  { region: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { region: "Belarus", code: "+375", flag: "🇧🇾" },
  { region: "Belgium", code: "+32", flag: "🇧🇪" },
  { region: "Belize", code: "+501", flag: "🇧🇿" },
  { region: "Benin", code: "+229", flag: "🇧🇯" },
  { region: "Bolivia", code: "+591", flag: "🇧🇴" },
  { region: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦" },
  { region: "Botswana", code: "+267", flag: "🇧🇼" },
  { region: "Brazil", code: "+55", flag: "🇧🇷" },
  { region: "Brunei", code: "+673", flag: "🇧🇳" },
  { region: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { region: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { region: "Burundi", code: "+257", flag: "🇧🇮" },
  { region: "Cambodia", code: "+855", flag: "🇰🇭" },
  { region: "Cameroon", code: "+237", flag: "🇨🇲" },
  { region: "Canada", code: "+1", flag: "🇨🇦" },
  { region: "Cape Verde", code: "+238", flag: "🇨🇻" },
  { region: "Central African Republic", code: "+236", flag: "🇨🇫" },
  { region: "Chad", code: "+235", flag: "🇹🇩" },
  { region: "Chile", code: "+56", flag: "🇨🇱" },
  { region: "China", code: "+86", flag: "🇨🇳" },
  { region: "Colombia", code: "+57", flag: "🇨🇴" },
  { region: "Comoros", code: "+269", flag: "🇰🇲" },
  { region: "Congo", code: "+242", flag: "🇨🇬" },
  { region: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { region: "Croatia", code: "+385", flag: "🇭🇷" },
  { region: "Cuba", code: "+53", flag: "🇨🇺" },
  { region: "Cyprus", code: "+357", flag: "🇨🇾" },
  { region: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { region: "Denmark", code: "+45", flag: "🇩🇰" },
  { region: "Djibouti", code: "+253", flag: "🇩🇯" },
  { region: "Dominican Republic", code: "+1-809", flag: "🇩🇴" },
  { region: "Ecuador", code: "+593", flag: "🇪🇨" },
  { region: "Egypt", code: "+20", flag: "🇪🇬" },
  { region: "El Salvador", code: "+503", flag: "🇸🇻" },
  { region: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { region: "Eritrea", code: "+291", flag: "🇪🇷" },
  { region: "Estonia", code: "+372", flag: "🇪🇪" },
  { region: "Eswatini", code: "+268", flag: "🇸🇿" },
  { region: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { region: "Fiji", code: "+679", flag: "🇫🇯" },
  { region: "Finland", code: "+358", flag: "🇫🇮" },
  { region: "France", code: "+33", flag: "🇫🇷" },
  { region: "Gabon", code: "+241", flag: "🇬🇦" },
  { region: "Gambia", code: "+220", flag: "🇬🇲" },
  { region: "Georgia", code: "+995", flag: "🇬🇪" },
  { region: "Germany", code: "+49", flag: "🇩🇪" },
  { region: "Ghana", code: "+233", flag: "🇬🇭" },
  { region: "Greece", code: "+30", flag: "🇬🇷" },
  { region: "Guatemala", code: "+502", flag: "🇬🇹" },
  { region: "Guinea", code: "+224", flag: "🇬🇳" },
  { region: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { region: "Guyana", code: "+592", flag: "🇬🇾" },
  { region: "Haiti", code: "+509", flag: "🇭🇹" },
  { region: "Honduras", code: "+504", flag: "🇭🇳" },
  { region: "Hungary", code: "+36", flag: "🇭🇺" },
  { region: "Iceland", code: "+354", flag: "🇮🇸" },
  { region: "India", code: "+91", flag: "🇮🇳" },
  { region: "Indonesia", code: "+62", flag: "🇮🇩" },
  { region: "Iran", code: "+98", flag: "🇮🇷" },
  { region: "Iraq", code: "+964", flag: "🇮🇶" },
  { region: "Ireland", code: "+353", flag: "🇮🇪" },
  { region: "Israel", code: "+972", flag: "🇮🇱" },
  { region: "Italy", code: "+39", flag: "🇮🇹" },
  { region: "Ivory Coast", code: "+225", flag: "🇨🇮" },
  { region: "Jamaica", code: "+1-876", flag: "🇯🇲" },
  { region: "Japan", code: "+81", flag: "🇯🇵" },
  { region: "Jordan", code: "+962", flag: "🇯🇴" },
  { region: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { region: "Kenya", code: "+254", flag: "🇰🇪" },
  { region: "Kuwait", code: "+965", flag: "🇰🇼" },
  { region: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
  { region: "Laos", code: "+856", flag: "🇱🇦" },
  { region: "Latvia", code: "+371", flag: "🇱🇻" },
  { region: "Lebanon", code: "+961", flag: "🇱🇧" },
  { region: "Lesotho", code: "+266", flag: "🇱🇸" },
  { region: "Liberia", code: "+231", flag: "🇱🇷" },
  { region: "Libya", code: "+218", flag: "🇱🇾" },
  { region: "Lithuania", code: "+370", flag: "🇱🇹" },
  { region: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { region: "Madagascar", code: "+261", flag: "🇲🇬" },
  { region: "Malawi", code: "+265", flag: "🇲🇼" },
  { region: "Malaysia", code: "+60", flag: "🇲🇾" },
  { region: "Maldives", code: "+960", flag: "🇲🇻" },
  { region: "Mali", code: "+223", flag: "🇲🇱" },
  { region: "Malta", code: "+356", flag: "🇲🇹" },
  { region: "Mauritania", code: "+222", flag: "🇲🇷" },
  { region: "Mauritius", code: "+230", flag: "🇲🇺" },
  { region: "Mexico", code: "+52", flag: "🇲🇽" },
  { region: "Moldova", code: "+373", flag: "🇲🇩" },
  { region: "Monaco", code: "+377", flag: "🇲🇨" },
  { region: "Mongolia", code: "+976", flag: "🇲🇳" },
  { region: "Montenegro", code: "+382", flag: "🇲🇪" },
  { region: "Morocco", code: "+212", flag: "🇲🇦" },
  { region: "Mozambique", code: "+258", flag: "🇲🇿" },
  { region: "Myanmar", code: "+95", flag: "🇲🇲" },
  { region: "Namibia", code: "+264", flag: "🇳🇦" },
  { region: "Nepal", code: "+977", flag: "🇳🇵" },
  { region: "Netherlands", code: "+31", flag: "🇳🇱" },
  { region: "New Zealand", code: "+64", flag: "🇳🇿" },
  { region: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { region: "Niger", code: "+227", flag: "🇳🇪" },
  { region: "Nigeria", code: "+234", flag: "🇳🇬" },
  { region: "North Korea", code: "+850", flag: "🇰🇵" },
  { region: "North Macedonia", code: "+389", flag: "🇲🇰" },
  { region: "Norway", code: "+47", flag: "🇳🇴" },
  { region: "Oman", code: "+968", flag: "🇴🇲" },
  { region: "Pakistan", code: "+92", flag: "🇵🇰" },
  { region: "Panama", code: "+507", flag: "🇵🇦" },
  { region: "Papua New Guinea", code: "+675", flag: "🇵🇬" },
  { region: "Paraguay", code: "+595", flag: "🇵🇾" },
  { region: "Peru", code: "+51", flag: "🇵🇪" },
  { region: "Philippines", code: "+63", flag: "🇵🇭" },
  { region: "Poland", code: "+48", flag: "🇵🇱" },
  { region: "Portugal", code: "+351", flag: "🇵🇹" },
  { region: "Qatar", code: "+974", flag: "🇶🇦" },
  { region: "Romania", code: "+40", flag: "🇷🇴" },
  { region: "Russia", code: "+7", flag: "🇷🇺" },
  { region: "Rwanda", code: "+250", flag: "🇷🇼" },
  { region: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { region: "Senegal", code: "+221", flag: "🇸🇳" },
  { region: "Serbia", code: "+381", flag: "🇷🇸" },
  { region: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { region: "Singapore", code: "+65", flag: "🇸🇬" },
  { region: "Slovakia", code: "+421", flag: "🇸🇰" },
  { region: "Slovenia", code: "+386", flag: "🇸🇮" },
  { region: "Somalia", code: "+252", flag: "🇸🇴" },
  { region: "South Africa", code: "+27", flag: "🇿🇦" },
  { region: "South Korea", code: "+82", flag: "🇰🇷" },
  { region: "South Sudan", code: "+211", flag: "🇸🇸" },
  { region: "Spain", code: "+34", flag: "🇪🇸" },
  { region: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { region: "Sudan", code: "+249", flag: "🇸🇩" },
  { region: "Suriname", code: "+597", flag: "🇸🇷" },
  { region: "Sweden", code: "+46", flag: "🇸🇪" },
  { region: "Switzerland", code: "+41", flag: "🇨🇭" },
  { region: "Syria", code: "+963", flag: "🇸🇾" },
  { region: "Taiwan", code: "+886", flag: "🇹🇼" },
  { region: "Tajikistan", code: "+992", flag: "🇹🇯" },
  { region: "Tanzania", code: "+255", flag: "🇹🇿" },
  { region: "Thailand", code: "+66", flag: "🇹🇭" },
  { region: "Togo", code: "+228", flag: "🇹🇬" },
  { region: "Trinidad and Tobago", code: "+1-868", flag: "🇹🇹" },
  { region: "Tunisia", code: "+216", flag: "🇹🇳" },
  { region: "Turkey", code: "+90", flag: "🇹🇷" },
  { region: "Turkmenistan", code: "+993", flag: "🇹🇲" },
  { region: "Uganda", code: "+256", flag: "🇺🇬" },
  { region: "Ukraine", code: "+380", flag: "🇺🇦" },
  { region: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { region: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { region: "United States", code: "+1", flag: "🇺🇸" },
  { region: "Uruguay", code: "+598", flag: "🇺🇾" },
  { region: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { region: "Venezuela", code: "+58", flag: "🇻🇪" },
  { region: "Vietnam", code: "+84", flag: "🇻🇳" },
  { region: "Yemen", code: "+967", flag: "🇾🇪" },
  { region: "Zambia", code: "+260", flag: "🇿🇲" },
  { region: "Zimbabwe", code: "+263", flag: "🇿🇼" },
];

type Country = (typeof ALL_COUNTRIES)[number];

interface AddressDetails {
  region: string;
  title: string;
  address: string;
  state: string;
  city: string;
  phone: string;
  flag: string;
  countryCode: string;
}

const EMPTY_ADDRESS: AddressDetails = {
  region: "",
  title: "",
  address: "",
  state: "",
  city: "",
  phone: "",
  flag: "",
  countryCode: "",
};

const NewAddress = () => {
  const router = useRouter();
  const [details, setDetails] = useState<AddressDetails>(EMPTY_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedCountry = ALL_COUNTRIES.find((c) => c.region === details.region) ?? null;

  const filteredCountries = ALL_COUNTRIES.filter((c) =>
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  const isDisabled =
    !details.region ||
    !details.title ||
    !details.address ||
    !details.state ||
    !details.city ||
    !details.phone;

  const set = (field: keyof AddressDetails) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setDetails((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCountrySelect = (country: Country) => {
    setDetails((prev) => ({
      ...prev,
      region: country.region,
      flag: country.flag,
      countryCode: country.code,
    }));
    setIsDropdownOpen(false);
    setSearch("");
  };

  const handleSave = async () => {
    if (isDisabled) return;
    setLoading(true);
    try {
      const saveResult = await saveAddressDB(details);
      if (!saveResult.success) {
        toast.error("Your address wasn't saved. Please try again.");
        return;
      }
      toast.success("Address saved successfully!");
      setDetails(EMPTY_ADDRESS);
      router.back();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown on outside click or scroll
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setSearch("");
      }
    };
    const handleScroll = () => {
      setIsDropdownOpen(false);
      setSearch("");
    };
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) searchRef.current?.focus();
  }, [isDropdownOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 md:px-16 lg:px-32 py-12 flex flex-col lg:flex-row gap-16 items-start justify-between">
        {/* ── Form ── */}
        <div className="w-full lg:max-w-lg">
          <div className="mb-8">
            <p className="text-sm font-medium text-[#1a9376] uppercase tracking-widest mb-1">
              Shipping Details
            </p>
            <h1 className="text-3xl font-bold text-gray-800">
              Add New Address
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Fill in the fields below to save a delivery address.
            </p>
          </div>

          <div className="space-y-4">
            {/* Country Dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <Globe className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                Country / Region
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#1a9376] transition-colors text-left"
              >
                {selectedCountry ? (
                  <span className="flex items-center gap-2 text-gray-700 font-medium">
                    <span className="text-xl">{selectedCountry.flag}</span>
                    {selectedCountry.region}
                    <span className="text-gray-400 text-sm font-normal">
                      ({selectedCountry.code})
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-400">Select a country…</span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {/* Search */}
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        ref={searchRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search country…"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a9376]"
                      />
                    </div>
                  </div>

                  {/* Country list */}
                  <ul className="max-h-56 overflow-y-auto">
                    {filteredCountries.length === 0 ? (
                      <li className="px-4 py-3 text-sm text-gray-400 text-center">
                        No countries found
                      </li>
                    ) : (
                      filteredCountries.map((country) => (
                        <li
                          key={country.region}
                          onClick={() => handleCountrySelect(country)}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors hover:bg-[#f0faf7] ${
                            details.region === country.region
                              ? "bg-[#f0faf7] text-[#1a9376] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="flex-1">{country.region}</span>
                          <span className="text-gray-400 text-xs">{country.code}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <Home className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                Address Title
              </label>
              <input
                type="text"
                placeholder="e.g. Home, Office, Warehouse"
                value={details.title}
                onChange={set("title")}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:border-[#1a9376] transition-colors text-gray-700 placeholder-gray-300"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <MapPin className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                Full Address
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 9 Solanke Ebube Street, Victoria Island"
                value={details.address}
                onChange={set("address")}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:border-[#1a9376] transition-colors text-gray-700 placeholder-gray-300 resize-none"
              />
            </div>

            {/* State & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lagos"
                  value={details.state}
                  onChange={set("state")}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:border-[#1a9376] transition-colors text-gray-700 placeholder-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ikeja"
                  value={details.city}
                  onChange={(e) =>
                    setDetails((p) => ({ ...p, city: e.target.value.trim() }))
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:border-[#1a9376] transition-colors text-gray-700 placeholder-gray-300"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <Phone className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                Phone Number
              </label>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 shadow-sm focus-within:border-[#1a9376] transition-colors bg-white">
                {/* Dial code badge */}
                <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-gray-200 min-w-fit">
                  {selectedCountry ? (
                    <>
                      <span className="text-base">{selectedCountry.flag}</span>
                      <span className="text-sm text-gray-600 font-medium">
                        {selectedCountry.code}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">+???</span>
                  )}
                </div>
                <input
                  type="tel"
                  placeholder={
                    selectedCountry ? "Phone number" : "Select a country first"
                  }
                  disabled={!details.region}
                  value={details.phone}
                  onChange={(e) =>
                    setDetails((p) => ({ ...p, phone: e.target.value.trim() }))
                  }
                  className="flex-1 px-4 py-3 outline-none text-gray-700 placeholder-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Validation hint */}
          {isDisabled && (
            <p className="mt-4 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Please fill in all fields to save your address.
            </p>
          )}

          {/* Save button */}
          <button
            disabled={isDisabled || loading}
            onClick={handleSave}
            className={`mt-6 w-full py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all ${
              isDisabled || loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#043033] text-white hover:bg-[#1a9376] shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              "Save Address"
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-3 w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* ── Illustration ── */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 pt-10">
          <Image
            src="/my_location_image.svg"
            alt="Add address illustration"
            width={380}
            height={380}
            priority
          />
          <p className="mt-6 text-center text-gray-400 text-sm max-w-xs">
            Save multiple addresses and switch between them at checkout with a
            single tap.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewAddress;
