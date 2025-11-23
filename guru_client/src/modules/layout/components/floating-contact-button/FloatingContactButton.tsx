"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Fab, Tooltip } from "@mui/material"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"
import EmailIcon from "@mui/icons-material/Email"
import FacebookIcon from "@mui/icons-material/Facebook"
import CloseIcon from "@mui/icons-material/Close"
import ZaloIcon from "@modules/layout/components/icons/ZaloIcon"
import { StoreMetadata } from "types/global"
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled"

interface FloatingContactButtonProps {
  metadata: StoreMetadata
}

export default function FloatingContactButton({
  metadata,
}: FloatingContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleOpen = () => setIsOpen(!isOpen)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Listen for custom event to open floating contact
  useEffect(() => {
    const handleOpenFloatingContact = () => {
      setIsOpen(true)
    }

    window.addEventListener("openFloatingContact", handleOpenFloatingContact)
    return () => {
      window.removeEventListener(
        "openFloatingContact",
        handleOpenFloatingContact
      )
    }
  }, [])

  const contactItems = [
    {
      label: "Số điện thoại",
      value: metadata.phone_number,
      icon: <ContactPhoneIcon />,
      color: "#10b981", // Green
      action: () => {
        if (metadata.phone_number) {
          window.location.href = `tel:${metadata.phone_number}`
        }
      },
      show: !!metadata.phone_number,
    },
    {
      label: "Email",
      value: metadata.email_contact,
      icon: <EmailIcon />,
      color: "#3b82f6", // Blue
      action: () => {
        if (metadata.email_contact) {
          window.location.href = `mailto:${metadata.email_contact}`
        }
      },
      show: !!metadata.email_contact,
    },
    {
      label: "Facebook",
      value: metadata.facebook_link,
      icon: <FacebookIcon />,
      color: "#1877f2", // Facebook blue
      action: () => {
        if (metadata.facebook_link) {
          // Đảm bảo link là absolute URL
          let url = metadata.facebook_link
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`
          }
          window.open(url, "_blank", "noopener,noreferrer")
        }
      },
      show: !!metadata.facebook_link,
    },
    {
      label: "Zalo",
      value: metadata.zalo_link,
      icon: (
        <div className="!p-0">
          <ZaloIcon className="!w-6 !h-6" />
        </div>
      ),
      color: "#0068ff", // Zalo blue
      action: () => {
        if (metadata.zalo_link) {
          // Đảm bảo link là absolute URL
          let url = metadata.zalo_link
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`
          }
          window.open(url, "_blank", "noopener,noreferrer")
        }
      },
      show: !!metadata.zalo_link,
    },
  ].filter((item) => item.show)

  if (contactItems.length === 0) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
    >
      {/* Contact items */}
      <AnimatePresence>
        {isOpen && (
          <>
            {contactItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <Tooltip title={item.label} placement="left" arrow>
                  <div
                    style={{
                      position: "relative",
                      width: 56,
                      height: 56,
                    }}
                  >
                    {/* Blur background effect - liquid glass */}
                    <div
                      style={{
                        position: "absolute",
                        inset: -12,
                        borderRadius: "50%",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(30px)",
                        WebkitBackdropFilter: "blur(30px)",
                        filter: "blur(12px)",
                        zIndex: -1,
                        opacity: 0.9,
                      }}
                    />
                    <Fab
                      size="medium"
                      aria-label={item.label}
                      onClick={item.action}
                      sx={{
                        backgroundColor: "transparent",
                        color: item.color,
                        width: 56,
                        height: 56,
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: `1px solid rgba(255,255,255,0.3)`,
                        boxShadow: `0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)`,
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          transform: "scale(1.1)",
                          boxShadow: `0 6px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.15)`,
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {item.icon}
                    </Fab>
                  </div>
                </Tooltip>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.div
        animate={{
          rotate: isOpen ? 45 : 0,
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        style={{
          position: "relative",
        }}
      >
        {/* Blur background effect for main button - liquid glass */}
        <div
          style={{
            position: "absolute",
            inset: -14,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            filter: "blur(14px)",
            zIndex: -1,
            opacity: 0.95,
          }}
        />
        <Fab
          size="large"
          aria-label="contact"
          onClick={toggleOpen}
          sx={{
            backgroundColor: "transparent",
            color: "#ec4899",
            width: 64,
            height: 64,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow:
              "0 4px 28px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              boxShadow:
                "0 6px 36px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.15)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {isOpen ? <CloseIcon /> : <PhoneEnabledIcon />}
        </Fab>
      </motion.div>
    </div>
  )
}
