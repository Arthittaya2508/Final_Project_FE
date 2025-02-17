'use client'

import React from 'react'
import { Avatar, AvatarIcon } from "@heroui/react"
import Text from '@/components/Text'
import { useAuthContext } from '@/context/AuthProvider'
import { capitalize } from '@/lib/utils'

const AccountSection = (): JSX.Element => {
  const { username } = useAuthContext()

  const userData = [
    {
      name: username ? capitalize(username) : '-',
      avatar: <AvatarIcon />,
    },
  ]

  return (
    <div className="flex flex-row justify-end">
      {userData.map((user, index) => (
        <div key={index} className="flex items-center gap-2">
          <Text as="p" variant="text-medium" className='sm:text-medium'>
            {user.name}
          </Text>
          <Avatar
            classNames={{
              base: 'bg-primary-100',
              icon: 'text-primary-700',
            }}
            icon={user.avatar}
            size="md"
          />
        </div>
      ))}
    </div>
  )
}

export default AccountSection
