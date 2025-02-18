'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { TbHome, TbBriefcase, TbLogout, TbChevronDown, TbChevronUp } from 'react-icons/tb'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const active =
  'relative flex h-11 flex-row items-center border-transparent rounded bg-primary-200 text-primary-900'
const inactive =
  'relative flex h-11 flex-row items-center border-transparent text-white hover:rounded hover:bg-primary-200 hover:text-primary-900 focus:outline-none'

const logoData = {
  src: '/images/cat.jpg',
  alt: 'Logo',
  height: 80,
  width: 80,
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: <TbHome />,
    href: '/',
  },
  {
    label: 'ข้อมูลสินค้า',
    icon: <TbBriefcase />,
    href: '#',
    submenu: [
      { label: 'ข้อมูลสินค้า', href: '/admin/page/products' },
      { label: 'ข้อมูลประเภท', href: '/product/category' },
      { label: 'ข้อมูลแบรนด์', href: '/product/brand' },
      { label: 'ข้อมูลสี', href: '/product/color' },
      { label: 'ข้อมูลขนาด', href: '/product/size' },
      { label: 'ข้อมูลเพศ', href: '/product/gender' },
    ],
  },
  {
    label: 'ข้อมูลขนส่ง',
    icon: <TbBriefcase />,
    href: '/transport',
  },
  {
    label: 'ข้อมูลลูกค้า',
    icon: <TbLogout />,
    href: '/customer',
  },
  {
    label: 'ข้อมูลพนักงาน',
    icon: <TbHome />,
    href: '/employee',
  },
  {
    label: 'ข้อมูลรายงาน',
    icon: <TbBriefcase />,
    href: '#',
    submenu: [
      { label: 'ข้อมูลรายงาน', href: '/product/category' },
      { label: 'ข้อมูลรายเดือน', href: '/product/brand' },
    ],
  },
  {
    label: 'logout',
    icon: <TbLogout />,
    href: '/customer',
    isBottom: true,
  },
]

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const currentPath = usePathname()

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  return (
    <>
      {/* Logo Section */}
      <div className="flex flex-col items-center min-h-screen bg-gray-800">
        {/* Logo Section */}
        <div className="mt-6 mb-4">
          <Image
            src={logoData.src}
            alt={logoData.alt}
            width={logoData.width}
            height={logoData.height}
            className="rounded-full object-cover"
          />
        </div>

        {/* Menu Items */}
        <div className="w-full flex-grow">
          <ul className="flex flex-col px-4 py-4">
            {menuItems
              .filter(item => !item.isBottom)
              .map((item, index) => (
                <li key={index} className="w-full">
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`w-full text-left ${
                          currentPath === item.href ? active : inactive
                        }`}
                      >
                        <span className="inline-flex items-center justify-center pl-2 pr-4 text-xl">
                          {item.icon}
                        </span>
                        <span className="text-md truncate tracking-wide">
                          {item.label}
                        </span>
                        <span className="ml-auto pr-2">
                          {openDropdown === item.label ? (
                            <TbChevronUp />
                          ) : (
                            <TbChevronDown />
                          )}
                        </span>
                      </button>
                      {openDropdown === item.label && (
                        <ul className="pl-6">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link legacyBehavior href={subItem.href}>
                                <a
                                  className={`block ${
                                    currentPath === subItem.href
                                      ? active
                                      : inactive
                                  }`}
                                >
                                  <span className="text-md truncate tracking-wide ml-5">
                                    {subItem.label}
                                  </span>
                                </a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link legacyBehavior href={item.href}>
                      <a
                        className={`w-full block ${
                          currentPath === item.href ? active : inactive
                        }`}
                      >
                        <span className="inline-flex items-center justify-center pl-2 pr-4 text-xl">
                          {item.icon}
                        </span>
                        <span className="text-md truncate tracking-wide">
                          {item.label}
                        </span>
                      </a>
                    </Link>
                  )}
                </li>
              ))}
          </ul>
        </div>

        {/* Bottom Items */}
        <ul className="mb-10 px-4 w-full">
          {menuItems
            .filter(item => item.isBottom)
            .map((item, index) => (
              <li key={index}>
                <Link legacyBehavior href={item.href}>
                  <a className="relative flex h-11 flex-row items-center border-transparent text-white hover:rounded hover:bg-primary-200 hover:text-primary-900 focus:outline-none w-full">
                    <span className="inline-flex items-center justify-center pl-2 pr-4 text-xl">
                      {item.icon}
                    </span>
                    <span className="text-md truncate tracking-wide">
                      {item.label}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  )
}

export default Sidebar
