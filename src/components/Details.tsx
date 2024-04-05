import { Address, Link } from "@yext/pages-components";
import { formatPhoneNumber } from "react-phone-number-input";
import List from "../components/List";

export interface DetailsProps {
  address: any;
  phone?: string;
  services?: string[];
}

const Details = ({ address, phone, services }: DetailsProps) => {
  return (
    <>
      <div className="border-b border-gray-300 bg-gray-100 shadow-md rounded-lg p-2 px-4 py-5 sm:p-6">
        <div className="grid gap-y-3">
          <div className="text-xl font-semibold">Store Details</div>
          <Address
            address={address}
            lines={[
              ["line1", "line2"],
              ["city", ",", "region"],
            ]}
          />
          {phone && (
            <span>
              <Link href={`tel:${phone}`} className="hover:underline">
                {formatPhoneNumber(phone)}
              </Link>
            </span>
          )}
          {services && <List list={services} />}
        </div>
      </div>
    </>
  );
};

export default Details;
