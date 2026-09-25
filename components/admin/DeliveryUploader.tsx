"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader, { type UploadTarget } from "@/components/pedido/FileUploader";
import { DELIVERY_ACCEPT, DELIVERY_MAX_MB, checkDeliveryUpload } from "@/lib/orders/files";

type DeliveryFile = { id: string; filename: string; mime: string; size_bytes: number; created_at: string };

// Subida de archivos finales por el editor: mismo cargador TUS del cliente, bucket "deliveries".
export default function DeliveryUploader({ orderId, initial }: { orderId: string; initial: DeliveryFile[] }) {
  const router = useRouter();
  const [files, setFiles] = useState(initial);

  const target: UploadTarget = {
    uploadUrl: `/api/admin/orders/${orderId}/deliveries/upload-url`,
    confirmUrl: `/api/admin/orders/${orderId}/deliveries`,
    deleteUrl: (id) => `/api/admin/orders/${orderId}/deliveries/${id}`,
    bucket: "deliveries",
    accept: DELIVERY_ACCEPT,
    maxFiles: 200,
    check: (file) => checkDeliveryUpload(file),
    title: "Sube los archivos finales",
    hint: `JPG, PNG, TIFF, MP4, MOV, ZIP, PDF o PSD · máximo ${DELIVERY_MAX_MB} MB cada uno`,
  };

  return (
    <FileUploader
      target={target}
      files={files}
      onFilesChange={(next) => {
        setFiles(next);
        router.refresh(); // habilita "Entregar" cuando ya hay archivos
      }}
    />
  );
}
