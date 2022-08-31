<template>
    <div v-pre class="form-text">
        (leave blank for default one)<br />
        Monitor:<br />
        {{NAME}}: Service Name<br />
        {{HOSTNAME}}: Hostname<br />
        {{HOSTNAME_OR_URL}}: Hostname or URL<br />
        {{INTERVAL}}: Heartbeat Interval<br />
        {{PORT}}: Port<br />
        {{TYPE}}: Monitor type<br />
        {{URL}}: URL<br />
        <br />
        Heartbeat:<br />
        {{DOWN_COUNT}}: Down count (if not zero)<br />
        {{DURATION}}: Duuration<br />
        {{IMPORTANT}}: Important if status changed<br />
        {{MSG}}: Message<br />
        {{PING}}: Last heartbeat ping<br />
        {{STATUS}}: Status<br />
        {{TIME_UTC}}: UTC Time<br />
        {{TIME:TimeZone}}: Time in specified time zone<br />
        <br />
        Conditional:<br />
        {{IF_DOWN}}...{{END_DOWN}}: If down, keep text between tags<br />
        {{IF_UP}}...{{END_UP}}: If up, keep text between tags<br />
    </div>
</template>

<script>
/**
 * Generic input field with a customizable action on the right.
 * Action is passed in as a function.
 */
export default {}
</script>