"use client";
import { useState} from "react";

export default function Home() {
  const [recipients, setRecipients] = useState([{ name: "", phone: "" }]);
  const [messageTemplate, setMessageTemplate] = useState(
    `Assalamualaikum Wr. Wb.\n\nYth. Bapak/Ibu {name}\n*Nasabah Bank Syariah Indonesia KCP Jakarta Rawamangun*\n\nPerkenalkan saya Fenty pegawai BSI KCP Rawamangun\n\nSemoga Bapak/Ibu {name} senantiasa sehat dan dalam lindungan Allah SWT.\n\nMohon segera pindah (migrasi) dan aktifkan BSI Mobile Bapak/Ibu {name} ke *Byond by BSI*. Aplikasi dapat di download di Play store atau App store *(mohon hanya download pada Play store atau App store)* , atau mengikuti pop up BSI mobile banking eksisting anda. Selanjutnya tinggal mengikuti tahapan yg ada.\n\nTerima kasih\u{1F64F}\u{1F3FB}\u{1F60A}\n\nWassalamu'alaikum Wr. Wb.\n\nNB: Apabila terdapat kendala pada saat aktivasi *Byond* , Bapak/Ibu dapat menghubungi petugas kami  dan atau datang langsung ke outlet BSI Kcp Jkt Rawamangun atau BSI terdekat.\n\n*Byond by BSI* #semuajadimudah`
  );
  // Add a new recipient
  const addRecipient = () => {
    setRecipients([...recipients, { name: "", phone: "" }]);
  };

  // Update recipient details
  const updateRecipient = (index: number, field: 'name' | 'phone', value: string) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index][field] = value;
    setRecipients(updatedRecipients);
  };

  // Generate message link for a single recipient
  const generateLink = (recipient: { name: string, phone: string }) => {
    const personalizedMessage = messageTemplate.replaceAll("{name}", recipient.name);
    const encodedMessage = encodeURIComponent(personalizedMessage);
    const link = `https://wa.me/${recipient.phone}?text=${encodedMessage}`;
    console.log(link);
    return link;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">WhatsApp Personalized Message Sender</h1>

      {/* Message Template Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-900">Message Template:</label>
        <textarea
          className="w-full p-2 border rounded text-gray-900"
          rows={6}
          value={messageTemplate}
          onChange={(e) => setMessageTemplate(e.target.value)}
          placeholder="Enter your message template here."
        />
      </div>

      {/* Recipient Inputs */}
      <h2 className="text-xl font-semibold mb-2 text-gray-900">Recipients:</h2>
      {recipients.map((recipient, index) => (
        <div key={index} className="flex gap-4 mb-2">
          <input
            type="text"
            className="w-1/2 p-2 border rounded text-gray-900"
            placeholder="Name"
            value={recipient.name}
            onChange={(e) => updateRecipient(index, "name", e.target.value)}
          />
          <input
            type="text"
            className="w-1/2 p-2 border rounded text-gray-900"
            placeholder="Phone Number (with country code)"
            value={recipient.phone}
            onChange={(e) => updateRecipient(index, "phone", e.target.value)}
          />
          <a
            href={generateLink(recipient)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Send
          </a>
        </div>
      ))}

      {/* Add Recipient Button */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        onClick={addRecipient}
      >
        Add Recipient
      </button>
    </div>
  );
}
