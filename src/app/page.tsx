"use client";
import { useEffect, useState} from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [recipients, setRecipients] = useState([{ name: "", phone: "" }]);
  const [messageTemplate, setMessageTemplate] = useState(
    `Assalamualaikum Wr. Wb.\n\nYth. Bapak/Ibu {name}\n*Nasabah Bank Syariah Indonesia KCP Jakarta Rawamangun*\n\nPerkenalkan saya Fenty pegawai BSI KCP Rawamangun\n\nSemoga Bapak/Ibu {name} senantiasa sehat dan dalam lindungan Allah SWT.\n\nMohon segera pindah (migrasi) dan aktifkan BSI Mobile Bapak/Ibu {name} ke *Byond by BSI*. Aplikasi dapat di download di Play store atau App store *(mohon hanya download pada Play store atau App store)* , atau mengikuti pop up BSI mobile banking eksisting anda. Selanjutnya tinggal mengikuti tahapan yg ada.\n\nTerima kasih\u{1F64F}\u{1F3FB}\u{1F60A}\n\nWassalamu'alaikum Wr. Wb.\n\nNB: Apabila terdapat kendala pada saat aktivasi *Byond* , Bapak/Ibu dapat menghubungi petugas kami  dan atau datang langsung ke outlet BSI Kcp Jkt Rawamangun atau BSI terdekat.\n\n*Byond by BSI*\n #semuajadimudah`
  );
  
  useEffect(() =>{
    const cachedRecipients = localStorage.getItem("recipients");
    const cachedMessageTemplate = localStorage.getItem("messageTemplate");
    if (cachedRecipients) {
      setRecipients(JSON.parse(cachedRecipients));
    }
    if (cachedMessageTemplate) {
      setMessageTemplate((cachedMessageTemplate));
      console.log(cachedMessageTemplate)
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recipients", JSON.stringify(recipients));
  }, [recipients]);

  // Save message template to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("messageTemplate", messageTemplate);
  }, [messageTemplate]);

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

  const resetData = () => {
    setRecipients([{ name: "", phone: "" }]);
    localStorage.removeItem("recipients");
    localStorage.removeItem("messageTemplate"); 
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(sheetName);

        const newRecipients = parsedData.map((row: unknown) => {
          const typedRow = row as { Nama: string; No_HP: string };
          return {
            name: typedRow.Nama || "",
            phone: typedRow.No_HP || ""
          };
        });
        setRecipients(newRecipients);      }
    };    reader.readAsArrayBuffer(file);
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
      <div className="mb-4">
        <label className="block font-medium mb-2 text-gray-900">Upload Excel:</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-2"
        />
        <a
          href="/template.xlsx" 
          download="template.xlsx"
          className="text-blue-500 underline"
        >
          Download Excel Template
        </a>
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
      <button
        className="px-4 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={resetData}
      >
        Reset Receipients
      </button>
    </div>
  );
}