import { useEffect, useState } from "react";
import DeviceMockup from "./DeviceMockup";

export default function Gallery({
  images,
  deviceType,
  onImageClick, // expects ({ images, index })
  dualDevice,
}) {
  // single carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  // auto-advance
  useEffect(() => {
    if (!images?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images?.length]);

  const handlePrev = () => {
    if (!images?.length) return;
    setCurrentIndex((p) => (p - 1 + images.length) % images.length);
  };

  const handleNext = (index) => {
    if (!images?.length) return;
    if (typeof index === "number") setCurrentIndex(index);
    else setCurrentIndex((p) => (p + 1) % images.length);
  };

  // If dual device provided, render both
  if (dualDevice?.desktop && dualDevice?.mobile) {
    const order = dualDevice.order ?? ["desktop", "mobile"]; // 👈 control order here
    const [dIdx, setDIdx] = useState(0);
    const [mIdx, setMIdx] = useState(0);

    // desktop auto-advance
    useEffect(() => {
      const t = setInterval(() => {
        setDIdx((p) => (p + 1) % dualDevice.desktop.images.length);
      }, 3200);
      return () => clearInterval(t);
    }, [dualDevice.desktop.images.length]);

    // mobile auto-advance
    useEffect(() => {
      const t = setInterval(() => {
        setMIdx((p) => (p + 1) % dualDevice.mobile.images.length);
      }, 3000);
      return () => clearInterval(t);
    }, [dualDevice.mobile.images.length]);

    // Create components map
    const components = {
      desktop: (
        <DeviceMockup
          key="desktop"
          type={dualDevice.desktop.type}
          images={dualDevice.desktop.images}
          currentIndex={dIdx}
          onPrev={() =>
            setDIdx(
              (p) =>
                (p - 1 + dualDevice.desktop.images.length) %
                dualDevice.desktop.images.length
            )
          }
          onNext={(i) =>
            typeof i === "number"
              ? setDIdx(i)
              : setDIdx((p) => (p + 1) % dualDevice.desktop.images.length)
          }
          onImageClick={() =>
            onImageClick({
              images: dualDevice.desktop.images,
              index: dIdx,
            })
          }
        />
      ),
      mobile: (
        <DeviceMockup
          key="mobile"
          type={dualDevice.mobile.type}
          images={dualDevice.mobile.images}
          currentIndex={mIdx}
          onPrev={() =>
            setMIdx(
              (p) =>
                (p - 1 + dualDevice.mobile.images.length) %
                dualDevice.mobile.images.length
            )
          }
          onNext={(i) =>
            typeof i === "number"
              ? setMIdx(i)
              : setMIdx((p) => (p + 1) % dualDevice.mobile.images.length)
          }
          onImageClick={() =>
            onImageClick({
              images: dualDevice.mobile.images,
              index: mIdx,
            })
          }
        />
      ),
    };

    return (
      <div className="grid grid-cols-1 gap-6">
        {order.map((key) => components[key])}
      </div>
    );
  }

  // Fallback: single device (current behavior)
  return (
    <DeviceMockup
      type={deviceType}
      images={images}
      currentIndex={currentIndex}
      onPrev={handlePrev}
      onNext={handleNext}
      onImageClick={() =>
        onImageClick({
          images,
          index: currentIndex,
        })
      }
    />
  );
}
